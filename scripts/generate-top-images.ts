/**
 * TOPページ用画像生成スクリプト（Imagen）
 *
 * 生成する画像:
 *   public/images/hero.jpg          - ヒーローセクション
 *   public/images/cat-review.jpg    - レビューカテゴリ
 *   public/images/cat-campaign.jpg  - キャンペーンカテゴリ
 *   public/images/cat-guide.jpg     - 申し込みガイドカテゴリ
 *   public/images/cat-comparison.jpg- 他社比較カテゴリ
 *   public/images/cat-trouble.jpg   - トラブル対処カテゴリ
 *
 * 使い方: npx tsx scripts/generate-top-images.ts
 * オプション: --only hero  （指定した画像だけ再生成）
 */

import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_STUDIO_API_KEY ?? "" });
const IMAGES_DIR = path.join(process.cwd(), "public/images");

const IMAGES: { key: string; filename: string; prompt: string }[] = [
  {
    key: "hero",
    filename: "hero.jpg",
    prompt:
      "Flat vector illustration, wide 16:9 banner. A cozy Japanese home interior with glowing fiber optic cables connecting to a sleek router. Warm orange and white light emanating from the router. Speed lines and sparkles showing fast internet. Soft gradient background in white and light orange. Cute and friendly style, rounded shapes, pastel colors. No text, no letters, no numbers anywhere.",
  },
  {
    key: "cat-review",
    filename: "cat-review.jpg",
    prompt:
      "Flat vector illustration, square format. Five golden stars rating badge with a fiber optic cable glowing behind it. Speed test results on a cute smartphone screen. Orange and slate accents. Minimalist white background. Friendly Japanese illustration style, rounded shapes. No text, no letters, no numbers anywhere.",
  },
  {
    key: "cat-campaign",
    filename: "cat-campaign.jpg",
    prompt:
      "Flat vector illustration, square format. A large gift box with orange ribbon, coins and sparkles bursting out. A cashback badge with yen symbol in gold and orange. Confetti and celebration elements. White background with warm orange accents. Cute and friendly style, rounded shapes. No text, no letters, no numbers anywhere.",
  },
  {
    key: "cat-guide",
    filename: "cat-guide.jpg",
    prompt:
      "Flat vector illustration, square format. An open guide book with wifi signal rising from the pages. Step-by-step numbered circles with checkmarks. A cute router character with a friendly face. Orange and teal accents on white background. Friendly Japanese illustration style, rounded shapes. No text, no letters, no numbers anywhere.",
  },
  {
    key: "cat-comparison",
    filename: "cat-comparison.jpg",
    prompt:
      "Flat vector illustration, square format. A balance scale with two routers on each side, one glowing orange brighter than the other. Speed comparison bars with the orange one clearly taller. Trophy with number one badge in orange and gold. White background with orange and slate accents. Friendly Japanese illustration style. No text, no letters, no numbers anywhere.",
  },
  {
    key: "cat-trouble",
    filename: "cat-trouble.jpg",
    prompt:
      "Flat vector illustration, square format. A cute wrench and screwdriver fixing a router that has sparkles and repair effects around it. Warning triangle transforming into a green checkmark. Tools and gears in orange and slate colors. White background, friendly and reassuring style. No text, no letters, no numbers anywhere.",
  },
];

async function generateImage(item: (typeof IMAGES)[0]): Promise<void> {
  console.log(`🖼️  生成中: ${item.filename}...`);
  try {
    const response = await genai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: item.prompt,
      config: { responseModalities: ["TEXT", "IMAGE"] },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find(
      (p: { inlineData?: { data?: string; mimeType?: string } }) => p.inlineData?.data
    );

    if (!imagePart?.inlineData?.data) {
      console.log(`   ⚠️  画像データなし: ${item.filename}`);
      return;
    }

    const ext = imagePart.inlineData.mimeType === "image/png" ? "png" : "jpg";
    const actualFilename = item.filename.replace(/\.(jpg|png)$/, `.${ext}`);
    const outputPath = path.join(IMAGES_DIR, actualFilename);
    fs.writeFileSync(outputPath, Buffer.from(imagePart.inlineData.data, "base64"));
    console.log(`   ✅ 保存: public/images/${actualFilename}`);
  } catch (err) {
    console.log(`   ❌ エラー: ${item.filename} — ${(err as Error).message}`);
  }
}

async function main(): Promise<void> {
  if (!process.env.GOOGLE_AI_STUDIO_API_KEY) {
    console.error("❌ GOOGLE_AI_STUDIO_API_KEY が設定されていません");
    process.exit(1);
  }

  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const args = process.argv.slice(2);
  const onlyIndex = args.indexOf("--only");
  const onlyKey = onlyIndex !== -1 ? args[onlyIndex + 1] : null;

  const targets = onlyKey ? IMAGES.filter((i) => i.key === onlyKey) : IMAGES;

  if (targets.length === 0) {
    console.error(`❌ 対象画像が見つかりません: ${onlyKey}`);
    process.exit(1);
  }

  console.log(`\n🚀 TOPページ画像生成 開始（${targets.length}枚）\n`);

  for (const item of targets) {
    await generateImage(item);
    // API rate limit 対策
    if (targets.length > 1) await new Promise((r) => setTimeout(r, 3000));
  }

  console.log("\n🎉 完了");
}

main().catch((err) => {
  console.error("エラー:", err);
  process.exit(1);
});
