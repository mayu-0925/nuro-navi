"use client";
import Link from "next/link";
import type { ContentBlock } from "@/lib/types";
import { AFFILIATE_URL } from "@/lib/data";

function trackClick(position: string) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "affiliate_click", { provider: "nuro", position });
  }
}

export default function ArticleBody({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading2":
            return (
              <h2
                key={i}
                className="text-2xl font-black text-slate-900 border-l-4 border-orange-500 pl-4 mt-10 first:mt-0"
              >
                {block.text}
              </h2>
            );

          case "heading3":
            return (
              <h3 key={i} className="text-xl font-black text-slate-900 mt-6">
                {block.text}
              </h3>
            );

          case "paragraph":
            return (
              <p key={i} className="text-base text-slate-700 leading-loose">
                {block.text}
              </p>
            );

          case "list":
            return (
              <ul key={i} className="space-y-2">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-base text-slate-700">
                    <span className="text-orange-500 mt-1 flex-shrink-0">✓</span>
                    <span className="leading-loose">{item}</span>
                  </li>
                ))}
              </ul>
            );

          case "callout":
            return (
              <div
                key={i}
                className={`rounded-xl p-5 border ${
                  block.variant === "warning"
                    ? "bg-yellow-50 border-yellow-200"
                    : block.variant === "danger"
                    ? "bg-red-50 border-red-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <p className="text-base leading-loose text-slate-800">{block.text}</p>
              </div>
            );

          case "steps":
            return (
              <ol key={i} className="space-y-4">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white text-sm font-black flex items-center justify-center">
                      {j + 1}
                    </span>
                    <span className="text-base text-slate-700 leading-loose pt-0.5">{item}</span>
                  </li>
                ))}
              </ol>
            );

          case "definition_list":
            return (
              <dl key={i} className="space-y-0">
                {block.items.map((item, j) => (
                  <div key={j} className="flex gap-4 py-3 border-b border-slate-200 last:border-0">
                    <dt className="font-bold text-slate-900 text-base w-32 flex-shrink-0">{item.term}</dt>
                    <dd className="text-base text-slate-700 leading-loose flex-1">{item.description}</dd>
                  </div>
                ))}
              </dl>
            );

          case "editorial_note":
            return (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-bold text-slate-500 mb-2">編集部メモ</p>
                <p className="text-base text-slate-700 leading-loose">{block.text}</p>
              </div>
            );

          case "cta_banner":
            return (
              <div key={i} className="bg-slate-900 rounded-2xl p-6 text-white my-8">
                <p className="font-black text-lg mb-1">{block.title}</p>
                {block.description && (
                  <p className="text-sm text-slate-300 mb-4">{block.description}</p>
                )}
                <Link
                  href={AFFILIATE_URL}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  onClick={() => trackClick(`cta_banner_${i}`)}
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-center py-3 rounded-lg transition-colors"
                >
                  {block.buttonText ?? "NURO光の公式サイトへ →"}
                </Link>
              </div>
            );

          case "related_articles":
            return (
              <div key={i} className="border-t border-slate-200 pt-6">
                <p className="text-sm font-bold text-slate-500 mb-3">関連記事</p>
                <ul className="space-y-2">
                  {block.articles.map((a, j) => (
                    <li key={j}>
                      <Link href={`/blog/${a.slug}/`} className="text-base text-orange-600 hover:text-orange-700 font-bold hover:underline">
                        → {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
