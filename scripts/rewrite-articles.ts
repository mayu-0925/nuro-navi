/**
 * 既存記事リライトスクリプト
 * - updatedAt が最も古い記事から順に N 件リライト
 * - editorial_note・実測データを注入してE-E-A-T強化
 *
 * 使い方:
 *   全自動（古い順2件）: npx tsx scripts/rewrite-articles.ts
 *   件数指定:            npx tsx scripts/rewrite-articles.ts --count 5
 *   slug指定:            npx tsx scripts/rewrite-articles.ts --slug nuro-hikari-review-2025
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { editorialData } from "../lib/data";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const ARTICLES_DIR = path.join(process.cwd(), "content/articles");
const DEFAULT_REWRITE_COUNT = 2;

// ----------------------------------------------------------------
// システムプロンプト
// ----------------------------------------------------------------
const SYSTEM_PROMPT = `あなたはインターネット回線業界に10年以上携わる専門ライターです。
NURO光の技術仕様・料金体系・工事の流れ・他社との比較を熟知しており、
実際にNURO光に申し込み・速度計測・問い合わせ検証を行った体験をもとに情報を発信しています。

【ライティング方針】
- 事実と根拠をセットで書く（「速い」ではなく「実測平均897Mbpsで業界トップクラス」）
- 「この記事では〜」「筆者が〜」などAIらしい前置きを使わない
- 文体は必ず「です」「ます」調（敬体）で統一する
- 箇条書きの先頭に記号・ラベルを使わない
- list は1記事で3〜4箇所まで。1つのitemsは3〜6個に抑える
- 手順は steps ブロックを使う
- 「名称：説明文」の対応は definition_list ブロックを使う

【CVR向上のための必須ルール（最重要）】
- 速度が遅い・工事が不安・料金が高いなど「困りごと系」テーマでは、問題の根本解決としてNURO光への乗り換えを自然に提案するセクションを必ず含める
- 「今の回線を設定で改善する」で終わらせず、「根本解決は回線自体を変えること」という方向へ誘導する
- cta_bannerブロックの直前には必ず1〜2文のブリッジ文（「このような方にはNURO光がおすすめです」等）を paragraph で挿入する

【一次情報・体験談の組み込みルール（必須）】
- editorial_note ブロックを1〜2箇所必ず挿入する
- 提供された実測データ・体験談を具体的に引用する

【テキスト装飾ルール】
- **テキスト** → 太字（重要な数値・サービス名・結論に。1段落に1〜3箇所）
- ==テキスト== → 黄色マーカー（最強調キーフレーズ。1段落に0〜1箇所）
- [テキスト](URL) → インラインリンク（関連記事誘導に。1記事に2〜4箇所）
  【重要】サイト内記事へのリンクは必ず /blog/スラッグ/ の形式にする
- heading2 / heading3 / callout / table / bar_chart には装飾記法を使わない

【アフィリエイト方針】
- NURO光への申し込みが最良であることを自然に訴求
- cta_bannerは序盤・中盤・末尾の3箇所に配置
- まとめでNURO光をおすすめする理由を簡潔にクロージング`;

// ----------------------------------------------------------------
// リライトプロンプト生成
// ----------------------------------------------------------------
function buildRewritePrompt(article: Record<string, unknown>, today: string): string {
  const speedData = Object.entries(editorialData.speedTests)
    .map(([name, d]) => `- ${name}：下り${d.down}Mbps・上り${d.up}Mbps・Ping ${d.ping}ms（${d.testedAt}・${d.env}）`)
    .join("\n");

  const experienceData = Object.entries(editorialData.experiences)
    .map(([name, text]) => `- ${name}：${text}`)
    .join("\n");

  return `以下の記事を最新のライティング方針でリライトしてください。

【既存記事情報】
slug: ${article.slug}
title: ${article.title}
description: ${article.description}
category: ${article.category}

【編集部の実測データ・体験談（editorial_noteに積極活用）】
＜速度実測値＞
${speedData}

＜体験談＞
${experienceData}

【リライトの重点事項】
- editorial_note ブロックを1〜2箇所挿入し、上記の実測データ・体験談を引用する
- **太字** と ==マーカー== を積極活用して読みやすさを向上
- AIっぽい表現を排除し、体験に基づいた自然な文体にする
- 「結論→理由→根拠→補足」の構成で書き直す
- cta_bannerを序盤・中盤・末尾の3箇所に配置
- bodyブロックの合計は20〜28個に収める

【出力形式】コードブロック(\`\`\`json)で囲むこと。

{
  "slug": "${article.slug}",
  "title": "記事タイトル（32文字以内）",
  "description": "記事の要約（80〜120文字）",
  "category": "${article.category}",
  "publishedAt": "${article.publishedAt}",
  "updatedAt": "${today}",
  "body": [
    { "type": "callout", "emoji": "絵文字", "text": "この記事でわかること" },
    { "type": "heading2", "text": "見出し" },
    { "type": "paragraph", "text": "本文（**太字** ==マーカー==を活用）" },
    { "type": "editorial_note", "text": "編集部が実際に〜したところ、〜でした。" },
    { "type": "list", "items": ["箇条書き"] },
    { "type": "cta_banner", "title": "NURO光で快適な回線環境を", "description": "戸建て最大90,000円キャッシュバック中", "buttonText": "NURO光の公式サイトへ →" },
    { "type": "steps", "items": ["手順1", "手順2"] },
    { "type": "definition_list", "items": [{ "term": "名称", "description": "説明文" }] },
    { "type": "table", "headers": ["項目", "NURO光", "auひかり"], "rows": [["月額", "5,200円〜", "4,180円〜"]] },
    { "type": "bar_chart", "title": "速度比較", "items": [{ "label": "NURO光", "value": 897, "unit": "Mbps", "color": "bg-orange-400" }] },
    { "type": "related_articles", "articles": [{ "slug": "related-slug", "title": "関連記事タイトル" }] }
  ]
}`;
}

// ----------------------------------------------------------------
// 1記事リライト
// ----------------------------------------------------------------
async function rewriteArticle(filePath: string, allSlugs: string[]): Promise<void> {
  const raw = fs.readFileSync(filePath, "utf-8");
  const article = JSON.parse(raw);
  const today = new Date().toISOString().split("T")[0];

  console.log(`✏️  リライト中: ${article.title}`);

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildRewritePrompt(article, today) }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  let rewritten: Record<string, unknown>;
  const fullMatch = text.match(/```json\n([\s\S]*?)\n```/);
  if (fullMatch) {
    rewritten = JSON.parse(fullMatch[1]);
  } else {
    const openMatch = text.match(/```json\n([\s\S]*)/);
    if (!openMatch) {
      console.error(`  ❌ JSON抽出失敗: ${article.slug}`);
      return;
    }
    const trimmed = openMatch[1].replace(/```\s*$/, "").trimEnd();
    try {
      rewritten = JSON.parse(trimmed + "\n]}");
    } catch {
      try {
        rewritten = JSON.parse(trimmed.replace(/,?\s*$/, "") + "\n]}");
      } catch {
        console.error(`  ❌ JSON修復失敗: ${article.slug}`);
        return;
      }
    }
  }

  // slug と公開日は維持
  rewritten.slug = article.slug;
  rewritten.publishedAt = article.publishedAt;

  // related_articles のslugが存在するものだけ残す
  const body = rewritten.body as Array<Record<string, unknown>>;
  if (Array.isArray(body)) {
    rewritten.body = body.map((block) => {
      if (block.type === "related_articles" && Array.isArray(block.articles)) {
        block.articles = (block.articles as Array<{ slug: string; title: string }>)
          .filter((item) => allSlugs.includes(item.slug) && item.slug !== article.slug);
      }
      return block;
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(rewritten, null, 2), "utf-8");
  console.log(`  ✅ 完了: ${rewritten.title} (updatedAt: ${today})`);
}

// ----------------------------------------------------------------
// メイン
// ----------------------------------------------------------------
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const slugIndex = args.indexOf("--slug");
  const countIndex = args.indexOf("--count");

  const targetSlug = slugIndex !== -1 ? args[slugIndex + 1] : null;
  const rewriteCount = countIndex !== -1 ? parseInt(args[countIndex + 1]) : DEFAULT_REWRITE_COUNT;

  const allFiles = fs.readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(ARTICLES_DIR, f));

  const allSlugs = allFiles.map((f) => path.basename(f, ".json"));

  let targets: string[] = [];

  if (targetSlug) {
    targets = allFiles.filter((f) => path.basename(f, ".json") === targetSlug);
    if (targets.length === 0) {
      console.error(`対象記事が見つかりません: ${targetSlug}`);
      process.exit(1);
    }
  } else {
    // Search Console 優先スラッグがあればそれを使う
    const priorityFile = path.join(process.cwd(), "content/gsc-priority-slugs.json");
    let usedPriority = false;

    if (fs.existsSync(priorityFile)) {
      const prioritySlugs: string[] = JSON.parse(fs.readFileSync(priorityFile, "utf-8"));
      const priorityFiles = prioritySlugs
        .map((slug) => allFiles.find((f) => path.basename(f, ".json") === slug))
        .filter((f): f is string => f !== undefined)
        .slice(0, rewriteCount);

      if (priorityFiles.length > 0) {
        targets = priorityFiles;
        usedPriority = true;
        console.log(`🎯 Search Console 優先リストから ${targets.length} 件をリライトします:`);
        targets.forEach((f) => {
          const data = JSON.parse(fs.readFileSync(f, "utf-8"));
          console.log(`   - ${data.title}`);
        });
        console.log();
      }
    }

    if (!usedPriority) {
      const filesWithDate = allFiles.map((f) => {
        const data = JSON.parse(fs.readFileSync(f, "utf-8"));
        const lastUpdated = data.updatedAt ?? data.publishedAt ?? "2000-01-01";
        return { file: f, lastUpdated };
      });
      filesWithDate.sort((a, b) => a.lastUpdated.localeCompare(b.lastUpdated));
      targets = filesWithDate.slice(0, rewriteCount).map((f) => f.file);

      console.log(`📅 最終更新が古い ${rewriteCount} 件をリライトします:`);
      targets.forEach((f) => {
        const data = JSON.parse(fs.readFileSync(f, "utf-8"));
        console.log(`   - ${data.title}（最終更新: ${data.updatedAt ?? data.publishedAt}）`);
      });
      console.log();
    }
  }

  for (const file of targets) {
    await rewriteArticle(file, allSlugs);
    if (targets.length > 1) await new Promise((r) => setTimeout(r, 3000));
  }

  console.log("\n🎉 リライト完了");
}

main().catch((err) => {
  console.error("エラー:", err);
  process.exit(1);
});
