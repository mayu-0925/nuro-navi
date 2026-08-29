"use client";
import Link from "next/link";
import type { ContentBlock } from "@/lib/types";
import { AFFILIATE_URL } from "@/lib/data";

function trackClick(position: string) {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag("event", "affiliate_click", { provider: "nuro", position });
  }
}

function renderText(text: string): React.ReactNode {
  // **bold**, ==mark==, [text](url) のインライン記法を解析
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let i = 0;
  const regex = /(\*\*(.+?)\*\*|==(.+?)==|\[(.+?)\]\((.+?)\))/g;
  let match: RegExpExecArray | null;
  let lastIndex = 0;
  regex.lastIndex = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[0].startsWith("**")) {
      parts.push(<strong key={match.index}>{match[2]}</strong>);
    } else if (match[0].startsWith("==")) {
      parts.push(<mark key={match.index} className="bg-yellow-200 rounded px-0.5">{match[3]}</mark>);
    } else {
      // [text](url)
      const href = match[5];
      const isExternal = href.startsWith("http");
      parts.push(
        <a
          key={match.index}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer nofollow" : undefined}
          className="text-orange-600 underline hover:text-orange-700"
          onClick={isExternal ? () => trackClick(`inline_link_${match!.index}`) : undefined}
        >
          {match[4]}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : <>{parts}</>;
}

export default function ArticleBody({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading2":
            return (
              <h2 key={i} className="text-2xl font-black text-slate-900 border-l-4 border-orange-500 pl-4 mt-10 first:mt-0">
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
                {renderText(block.text)}
              </p>
            );

          case "list":
            return (
              <ul key={i} className="space-y-2">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-base text-slate-700">
                    <span className="text-orange-500 mt-1 flex-shrink-0">✓</span>
                    <span className="leading-loose">{renderText(item)}</span>
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
                {block.emoji && <span className="mr-2">{block.emoji}</span>}
                <span className="text-base leading-loose text-slate-800">{block.text}</span>
              </div>
            );

          case "editorial_note":
            return (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-bold text-slate-500 mb-2">編集部メモ</p>
                <p className="text-base text-slate-700 leading-loose">{block.text}</p>
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
                    <span className="text-base text-slate-700 leading-loose pt-0.5">{renderText(item)}</span>
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
                    <dd className="text-base text-slate-700 leading-loose flex-1">{renderText(item.description)}</dd>
                  </div>
                ))}
              </dl>
            );

          case "table":
            return (
              <div key={i} className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      {block.headers.map((h, j) => (
                        <th key={j} className="px-4 py-3 text-left font-bold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className={j % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        {row.map((cell, k) => (
                          <td key={k} className="px-4 py-3 border-b border-slate-200 text-slate-700">
                            {renderText(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "bar_chart":
            const max = Math.max(...block.items.map((it) => it.value));
            return (
              <div key={i}>
                <p className="font-bold text-slate-900 mb-3">{block.title}</p>
                <div className="space-y-3">
                  {block.items.map((it, j) => (
                    <div key={j}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-slate-700">{it.label}</span>
                        <span className="text-sm text-slate-500">{it.value.toLocaleString()}{it.unit}</span>
                      </div>
                      <div className="bg-slate-100 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-4 rounded-full ${it.color || "bg-orange-400"}`}
                          style={{ width: `${(it.value / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
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
