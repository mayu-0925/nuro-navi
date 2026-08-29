/**
 * NURO光乗り換えナビ 記事自動生成スクリプト
 *
 * Phase 1 (Keyword Agent) : 既存記事を把握し、未開拓テーマ・キーワードを選定
 * Phase 2 (Outline Agent) : 選定キーワードをもとに詳細な記事構成を設計
 * Phase 3 (Writer Agent)  : 構成に従い、高品質な記事本文 JSON を生成
 *
 * 使い方: npx tsx scripts/generate-article.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { topics } from "./topics";
import { editorialData, AFFILIATE_URL } from "../lib/data";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

// ----------------------------------------------------------------
// 既存記事の読み込み
// ----------------------------------------------------------------
function loadExistingArticles(): { slug: string; title: string; category: string }[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), "utf-8"));
        return { slug: data.slug ?? f.replace(".json", ""), title: data.title ?? "", category: data.category ?? "" };
      } catch {
        return null;
      }
    })
    .filter(Boolean) as { slug: string; title: string; category: string }[];
}

// ----------------------------------------------------------------
// Phase 1: キーワード・トピック選定エージェント
// ----------------------------------------------------------------
interface SelectedTopic {
  theme: string;
  targetKeyword: string;
  subKeywords: string[];
  searchIntent: string;
  targetReader: string;
  uniqueAngle: string;
  suggestedSlug: string;
}

async function phase1SelectTopic(
  existingArticles: { slug: string; title: string; category: string }[],
  today: string,
  priorityTopics: { query: string; impressions: number; position: number }[] = []
): Promise<SelectedTopic> {
  console.log("🔍 Phase 1: キーワード・トピック選定中...");

  const existingList = existingArticles
    .map((a) => `- ${a.slug}: 「${a.title}」(${a.category})`)
    .join("\n");

  const prioritySection =
    priorityTopics.length > 0
      ? `\n【最優先候補（Search Console 実データ）】\n${priorityTopics
          .map((t) => `- 「${t.query}」（${t.impressions}imp・平均${t.position}位）`)
          .join("\n")}\n上記クエリに対応する記事がまだ存在しないなら、これらを最優先で選ぶこと。\n`
      : "";

  const candidateList = topics
    .map((t) => `- テーマ: ${t.theme}\n  キーワード: ${t.keywords}\n  意図: ${t.intent}`)
    .join("\n");

  const systemPrompt = `あなたはSEO・コンテンツ戦略の専門家です。
NURO光専門アフィリエイトサイト「NURO光乗り換えナビ」の記事企画を担当しています。

サイトの特徴：
- NURO光への乗り換えを検討しているユーザー専門のサイト
- NURO光の速度・料金・キャッシュバック・工事・乗り換え情報を提供
- ターゲット：NURO光への乗り換えを具体的に検討中のユーザー

今日の日付: ${today}`;

  const userPrompt = `以下の既存記事と重複しない、新しい記事テーマを1つ選定してください。
${prioritySection}
【既存記事一覧】
${existingList || "（なし）"}

【候補テーマリスト】
${candidateList}

【選定条件】
1. 既存記事と内容・テーマが重複しないこと
2. 検索ボリュームが見込めるキーワードを含むこと
3. NURO光への乗り換えを検討しているユーザーが検索しそうなテーマ
4. 今の季節（${today.substring(5, 7)}月）や時事性があればなお良い
5. まだカバーできていない視点・ユーザー層を狙うこと

以下のJSON形式のみで回答してください（コードブロック不要）：
{
  "theme": "記事テーマのタイトル（日本語）",
  "targetKeyword": "メインキーワード（検索されそうな語句）",
  "subKeywords": ["サブキーワード1", "サブキーワード2", "サブキーワード3"],
  "searchIntent": "このキーワードで検索するユーザーの意図（1〜2文）",
  "targetReader": "ターゲット読者のペルソナ（1〜2文）",
  "uniqueAngle": "既存記事にはない、この記事ならではの切り口・価値（1〜2文）",
  "suggestedSlug": "URLスラッグ（英小文字・ハイフン区切り・既存スラッグと重複なし）"
}`;

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/) ?? [null, text];
  const topic: SelectedTopic = JSON.parse((jsonMatch[1] ?? text).trim());

  console.log(`   テーマ: ${topic.theme}`);
  console.log(`   キーワード: ${topic.targetKeyword}`);
  console.log(`   切り口: ${topic.uniqueAngle}`);
  return topic;
}

// ----------------------------------------------------------------
// Phase 2: 記事構成（アウトライン）設計エージェント
// ----------------------------------------------------------------
interface ArticleOutline {
  title: string;
  description: string;
  category: string;
  slug: string;
  seoSummary: string;
  sections: {
    heading: string;
    purpose: string;
    keyPoints: string[];
    blockTypes: string[];
    ctaPlacement?: boolean;
  }[];
  dataToInclude: string[];
  tableNeeded: boolean;
  chartNeeded: boolean;
  faqQuestions: string[];
}

async function phase2CreateOutline(topic: SelectedTopic, today: string): Promise<ArticleOutline> {
  console.log("📋 Phase 2: 記事構成（アウトライン）設計中...");

  const systemPrompt = `あなたはSEOコンテンツのエディターです。
NURO光専門アフィリエイトサイト向けに、質の高い記事構成を設計することが専門です。

設計基準：
- 読者の疑問を論理的な順序で解消する構成
- 「結論→理由→根拠→補足」の流れ
- NURO光への申し込みを自然に誘導できる構成
- 表・グラフは本当に必要な場合のみ（全体で最大2個）
- cta_bannerは序盤・中盤・末尾の3箇所`;

  const userPrompt = `以下のテーマ・キーワードで記事構成を設計してください。

【テーマ】${topic.theme}
【メインキーワード】${topic.targetKeyword}
【サブキーワード】${topic.subKeywords.join("、")}
【検索意図】${topic.searchIntent}
【ターゲット読者】${topic.targetReader}
【この記事の独自の切り口】${topic.uniqueAngle}
【公開日】${today}

設計してほしいもの：
1. SEO最適化されたタイトル（32文字以内）
2. メタdescription用のdescription（100文字以内）
3. 記事全体の見出し構成（h2セクション7〜10個）
4. 各セクションの目的・要点・使うブロックタイプ
5. 記事に含めるべき具体的なデータ・数値
6. 表・グラフが必要かどうかの判断
7. FAQセクション用の質問（3〜5個）

以下のJSON形式のみで回答してください（コードブロック不要）：
{
  "title": "記事タイトル（32文字以内）",
  "description": "記事要約（100文字以内）",
  "category": "review または campaign または guide または comparison または trouble",
  "slug": "${topic.suggestedSlug}",
  "seoSummary": "この記事のSEO上の強み（1文）",
  "sections": [
    {
      "heading": "見出しテキスト",
      "purpose": "このセクションの目的",
      "keyPoints": ["要点1", "要点2", "要点3"],
      "blockTypes": ["paragraph", "list", "table", "bar_chart", "steps", "definition_list", "callout", "editorial_note", "cta_banner"],
      "ctaPlacement": false
    }
  ],
  "dataToInclude": ["含めるべきデータ・数値"],
  "tableNeeded": false,
  "chartNeeded": false,
  "faqQuestions": ["FAQの質問1", "FAQの質問2", "FAQの質問3"]
}`;

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  let jsonStr = text;
  const codeBlockMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) jsonStr = codeBlockMatch[1];

  let outline: ArticleOutline;
  try {
    outline = JSON.parse(jsonStr.trim());
  } catch {
    const fixed = jsonStr.trim().replace(/,?\s*$/, "") + "\n}}";
    try {
      outline = JSON.parse(fixed);
    } catch {
      console.error("Phase 2 JSONパース失敗。先頭500字:\n", text.substring(0, 500));
      throw new Error("Phase 2: JSONのパースに失敗しました");
    }
  }

  console.log(`   タイトル: ${outline.title}`);
  console.log(`   セクション数: ${outline.sections?.length ?? 0}`);
  console.log(`   表: ${outline.tableNeeded} / グラフ: ${outline.chartNeeded}`);
  return outline;
}

// ----------------------------------------------------------------
// Phase 3: 記事本文生成エージェント
// ----------------------------------------------------------------
const WRITER_SYSTEM_PROMPT = `あなたはインターネット回線業界に10年以上携わる専門ライターです。
NURO光の技術仕様・料金体系・工事の流れ・他社との速度比較を熟知しており、
実際にNURO光に申し込み・速度計測・問い合わせ検証を行った体験をもとに情報を発信しています。

【ライティング方針】
- 読者はNURO光への乗り換えを前向きに検討している前提で書く
- 押しつけがましくならない程度に背中を押す（「〜すべき」ではなく「〜がおすすめです」等）
- 事実と根拠をセットで書く（「速い」ではなく「実測平均897Mbpsで業界トップクラス」）
- 「この記事では〜」「筆者が〜」などAIらしい前置きを使わない
- 文体は必ず「です」「ます」調（敬体）で統一する
- 自然な人間のライターが書いたような、読みやすく簡潔な文体にする
- 箇条書きの先頭に「・」「•」「-」「STEP X：」などを使わない
- list の各itemに「**名前**：説明」形式を使わない
- list は1記事で3〜4箇所まで。1つのitemsは3〜6個に抑える
- 手順は steps ブロックを使う
- 「名称：説明文」の対応は definition_list ブロックを使う

【一次情報・体験談の組み込みルール（必須）】
- editorial_note ブロックを1〜2箇所挿入する
- 提供された実測データ・体験談を具体的に引用する
  例：「編集部が実際に計測したところ、下り平均897Mbpsでした」
  例：「申し込みから開通まで14日間でした」

【テキスト装飾ルール】
- paragraph と list の text で以下を積極活用
  - **テキスト** → 太字（重要な数値・サービス名・結論に。1段落に1〜3箇所）
  - ==テキスト== → 黄色マーカー（最強調キーフレーズ。1段落に0〜1箇所）
  - [テキスト](URL) → インラインリンク（関連記事誘導に。1記事に2〜4箇所）
    【重要】サイト内記事へのリンクは必ず /blog/スラッグ/ の形式にする
- heading2 / heading3 / callout / table / bar_chart には装飾記法を使わない

【アフィリエイト方針】
- NURO光への申し込みが最良であることを自然に訴求
- cta_bannerは序盤・中盤・末尾の3箇所に配置
- まとめでNURO光をおすすめする理由を簡潔にクロージング`;

async function phase3WriteArticle(
  topic: SelectedTopic,
  outline: ArticleOutline,
  today: string,
  existingArticles: { slug: string; title: string; category: string }[]
): Promise<object> {
  console.log("✍️  Phase 3: 記事本文生成中...");

  const sectionsDesc = outline.sections
    .map(
      (s, i) =>
        `セクション${i + 1}: 「${s.heading}」\n  目的: ${s.purpose}\n  要点: ${s.keyPoints.join("、")}\n  ブロック: ${s.blockTypes.join(", ")}${s.ctaPlacement ? "\n  ★cta_banner配置" : ""}`
    )
    .join("\n\n");

  const speedData = Object.entries(editorialData.speedTests)
    .map(([name, d]) => `- ${name}：下り平均${d.down}Mbps・上り平均${d.up}Mbps・Ping ${d.ping}ms（${d.testedAt}・${d.env}）`)
    .join("\n");

  const experienceData = Object.entries(editorialData.experiences)
    .map(([name, text]) => `- ${name}：${text}`)
    .join("\n");

  const userPrompt = `以下のアウトラインに従い、記事本文JSONを生成してください。

【記事情報】
タイトル: ${outline.title}
メインキーワード: ${topic.targetKeyword}
サブキーワード: ${topic.subKeywords.join("、")}
読者ペルソナ: ${topic.targetReader}
独自の切り口: ${topic.uniqueAngle}

【含めるべきデータ・数値】
${outline.dataToInclude.join("\n")}

【編集部の実測データ・体験談（editorial_noteに積極活用すること）】
＜速度実測値＞
${speedData}

＜体験談＞
${experienceData}

【記事構成（アウトライン）】
${sectionsDesc}

【FAQセクション（記事末尾に必ず含める）】
${outline.faqQuestions.map((q) => `- ${q}`).join("\n")}

【表・グラフ指示】
- 表（table）が必要: ${outline.tableNeeded}
- グラフ（bar_chart）が必要: ${outline.chartNeeded}
- 使う場合は合計最大2個まで

【内部リンク（関連記事）】
以下の既存記事の中から、今回の記事テーマと関連性の高いものを2〜3件選び、
記事の末尾（まとめの直後）に related_articles ブロックとして必ず含めること。
${existingArticles.slice(0, 30).map((a) => `- slug: "${a.slug}", title: "${a.title}"`).join("\n")}

【出力量の制約】
- bodyブロックの合計は20〜28個に収める
- paragraphは1セクションにつき1〜2個まで
- 1つのparagraphは150文字以内に抑える
- listのitemsは1つにつき4個まで
- stepsのitemsは1つにつき5個まで

【出力形式】
コードブロック(\`\`\`json)で囲むこと。

{
  "slug": "${outline.slug}",
  "title": "${outline.title}",
  "description": "${outline.description}",
  "category": "${outline.category}",
  "publishedAt": "${today}",
  "body": [
    { "type": "callout", "emoji": "絵文字", "text": "この記事でわかること" },
    { "type": "heading2", "text": "見出し" },
    { "type": "paragraph", "text": "本文（**太字** ==マーカー==を活用）" },
    { "type": "editorial_note", "text": "編集部が実際に〜したところ、〜でした。" },
    { "type": "list", "items": ["箇条書き"] },
    { "type": "cta_banner", "title": "NURO光で快適な回線環境を", "description": "戸建て最大90,000円キャッシュバック中", "buttonText": "NURO光の公式サイトへ →" },
    { "type": "steps", "items": ["手順1", "手順2"] },
    { "type": "definition_list", "items": [{ "term": "名称", "description": "説明文" }] },
    { "type": "table", "headers": ["項目", "NURO光", "auひかり"], "rows": [["月額料金", "5,200円〜", "4,180円〜"]] },
    { "type": "bar_chart", "title": "グラフタイトル", "items": [{ "label": "NURO光", "value": 897, "unit": "Mbps", "color": "bg-orange-400" }] },
    { "type": "heading3", "text": "小見出し" },
    { "type": "related_articles", "articles": [{ "slug": "existing-slug", "title": "既存記事タイトル" }] }
  ]
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: WRITER_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  let jsonStr: string;
  const closedMatch = text.match(/```json\n([\s\S]*?)\n```/);
  if (closedMatch) {
    jsonStr = closedMatch[1];
  } else {
    const openMatch = text.match(/```json\n([\s\S]*)/);
    jsonStr = openMatch ? openMatch[1] : text;
  }

  let article: Record<string, unknown>;
  try {
    article = JSON.parse(jsonStr.trim());
  } catch {
    const trimmed = jsonStr.trim().replace(/,\s*$/, "");
    const fixed = trimmed + "\n]}";
    try {
      article = JSON.parse(fixed);
      console.log("⚠️  JSONを補完して修復しました");
    } catch {
      console.error("Phase 3 JSONパース失敗。先頭500字:\n", text.substring(0, 500));
      process.exit(1);
    }
  }

  console.log(`   生成完了: ${(article.body as unknown[])?.length ?? 0} ブロック`);
  return article;
}

// ----------------------------------------------------------------
// メイン処理
// ----------------------------------------------------------------
async function main(): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  console.log(`\n🚀 記事自動生成 開始 (${today})\n`);

  if (!fs.existsSync(ARTICLES_DIR)) fs.mkdirSync(ARTICLES_DIR, { recursive: true });

  const existingArticles = loadExistingArticles();
  console.log(`📚 既存記事数: ${existingArticles.length}件\n`);

  // Search Console 優先クエリ
  const priorityTopicsFile = path.join(process.cwd(), "content/gsc-priority-topics.json");
  let priorityTopics: { query: string; impressions: number; position: number }[] = [];
  if (fs.existsSync(priorityTopicsFile)) {
    priorityTopics = JSON.parse(fs.readFileSync(priorityTopicsFile, "utf-8"));
    if (priorityTopics.length > 0) {
      console.log(`🎯 Search Console 優先クエリ: ${priorityTopics.length}件を Phase 1 に注入\n`);
    }
  }

  const topic = await phase1SelectTopic(existingArticles, today, priorityTopics);
  console.log();

  const outline = await phase2CreateOutline(topic, today);
  console.log();

  const article = await phase3WriteArticle(topic, outline, today, existingArticles) as Record<string, unknown>;
  console.log();

  // スラッグ重複チェック
  const existingSlugs = new Set(existingArticles.map((a) => a.slug));
  let slug = (article.slug as string) ?? outline.slug;
  if (existingSlugs.has(slug)) {
    slug = `${slug}-${Date.now()}`;
    article.slug = slug;
    console.log(`⚠️  スラッグが重複したため変更: ${slug}`);
  }

  const outputPath = path.join(ARTICLES_DIR, `${slug}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(article, null, 2), "utf-8");

  console.log(`✅ 記事を保存しました: content/articles/${slug}.json`);
  console.log(`   タイトル: ${article.title}`);
  console.log(`   カテゴリ: ${article.category}`);
}

main().catch((err) => {
  console.error("エラー:", err);
  process.exit(1);
});
