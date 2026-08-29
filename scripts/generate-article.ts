/**
 * NURO光乗り換えナビ 記事自動生成スクリプト
 * Phase 1: トピック選定
 * Phase 2: 記事執筆
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

const AFFILIATE_URL = "https://px.a8.net/svt/ejp?a8mat=2BJ8HV+6NXPKI+2VMU+64C3M";

const CATEGORIES = ["review", "campaign", "guide", "comparison", "trouble"];

const TOPIC_CANDIDATES = [
  // 比較系
  "NURO光 vs auひかり 速度・料金比較",
  "NURO光 vs ドコモ光 乗り換えどっちがお得",
  "NURO光 vs フレッツ光 速度比較",
  "NURO光 vs ソフトバンク光 キャッシュバック比較",
  // 乗り換え系
  "ドコモ光からNURO光へ乗り換え手順",
  "auひかりからNURO光乗り換え注意点",
  "フレッツ光からNURO光乗り換え費用",
  // 申し込みガイド
  "NURO光申し込み方法完全ガイド",
  "NURO光工事内容と当日の流れ",
  "NURO光エリア確認方法",
  // キャンペーン
  "NURO光キャッシュバック受け取り方法",
  "NURO光戸建て料金プラン解説",
  "NURO光マンション向けプラン解説",
  // トラブル
  "NURO光速度が遅い時の対処法",
  "NURO光工事日程が遅い場合の対応",
  // レビュー
  "NURO光口コミ・評判まとめ",
  "NURO光ゲーマー向けPing値レビュー",
];

function loadExistingArticles(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), "utf-8"));
        return data.title ?? "";
      } catch {
        return "";
      }
    })
    .filter(Boolean);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

async function phase1SelectTopic(existingTitles: string[]): Promise<{ topic: string; slug: string; category: string }> {
  console.log("🔍 Phase 1: トピック選定中...");
  const existingList = existingTitles.map((t) => `- ${t}`).join("\n");
  const today = new Date().toISOString().split("T")[0];

  const res = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `あなたはSEOとコンテンツ戦略の専門家です。
NURO光専門アフィリエイトサイト「NURO光乗り換えナビ」の記事企画を担当しています。

既存記事一覧：
${existingList || "（なし）"}

候補トピック一覧：
${TOPIC_CANDIDATES.map((t) => `- ${t}`).join("\n")}

上記候補から、既存記事と重複せず、NURO光への乗り換えを検討しているユーザーに最も刺さるトピックを1つ選んでください。
カテゴリは以下から選んでください：${CATEGORIES.join(", ")}

以下のJSON形式で回答してください（JSON以外は不要）：
{
  "topic": "記事のメインテーマ（日本語）",
  "slug": "url-friendly-english-slug",
  "category": "カテゴリ名"
}`,
      },
    ],
  });

  const text = (res.content[0] as any).text;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Phase1: JSON parse failed");
  return JSON.parse(match[0]);
}

async function phase2WriteArticle(topic: { topic: string; slug: string; category: string }): Promise<any> {
  console.log(`✍️  Phase 2: 記事執筆中「${topic.topic}」...`);
  const today = new Date().toISOString().split("T")[0];

  const res = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: `あなたはNURO光専門のウェブライターです。
「NURO光乗り換えナビ」というアフィリエイトサイト向けに、次のトピックで記事を書いてください。

トピック：${topic.topic}
カテゴリ：${topic.category}
アフィリエイトURL：${AFFILIATE_URL}

【必須ルール】
- 読者はNURO光への乗り換えを真剣に検討している
- 記事内の適切な箇所に必ずcta_bannerを1〜2回挿入する
- 最後はrelated_articlesで関連キーワードへの誘導
- 日本語・口語調・読みやすく
- 文字数：2000〜3000字相当のbodyブロック数

以下のJSON形式で記事全体を出力してください（JSON以外は出力不要）：
{
  "slug": "${topic.slug}",
  "title": "SEO最適化された魅力的なタイトル（28〜32文字）",
  "description": "メタディスクリプション（80〜120文字）",
  "category": "${topic.category}",
  "publishedAt": "${today}",
  "body": [
    ContentBlockの配列
  ]
}

ContentBlockの型定義：
- { "type": "heading2", "text": "..." }
- { "type": "heading3", "text": "..." }
- { "type": "paragraph", "text": "..." }
- { "type": "list", "items": ["...", "..."] }
- { "type": "callout", "variant": "info"|"warning"|"danger", "text": "..." }
- { "type": "editorial_note", "text": "..." }
- { "type": "steps", "items": ["手順1", "手順2", ...] }
- { "type": "definition_list", "items": [{"term": "...", "description": "..."}] }
- { "type": "cta_banner", "title": "...", "description": "...", "buttonText": "..." }
- { "type": "related_articles", "articles": [{"slug": "...", "title": "..."}] }`,
      },
    ],
  });

  const text = (res.content[0] as any).text;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Phase2: JSON parse failed");
  return JSON.parse(match[0]);
}

async function main() {
  if (!fs.existsSync(ARTICLES_DIR)) fs.mkdirSync(ARTICLES_DIR, { recursive: true });

  const existingTitles = loadExistingArticles();
  const topic = await phase1SelectTopic(existingTitles);
  console.log(`  選定トピック: ${topic.topic} (${topic.slug})`);

  const article = await phase2WriteArticle(topic);

  const outputPath = path.join(ARTICLES_DIR, `${article.slug}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(article, null, 2), "utf-8");
  console.log(`✅ 記事を保存しました: ${outputPath}`);
}

main().catch((e) => {
  console.error("❌ エラー:", e);
  process.exit(1);
});
