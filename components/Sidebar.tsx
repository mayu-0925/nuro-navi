import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { AFFILIATE_URL, CATEGORIES, NURO } from "@/lib/data";
import { formatDate } from "@/lib/date";

const CATEGORY_EMOJI: Record<string, string> = {
  review: "⭐",
  campaign: "🎁",
  guide: "📖",
  comparison: "⚖️",
  trouble: "🔧",
};

type Props = {
  recentArticles: Article[];
  currentSlug?: string;
};

export default function Sidebar({ recentArticles, currentSlug }: Props) {
  const others = recentArticles.filter((a) => a.slug !== currentSlug).slice(0, 5);

  return (
    <aside className="space-y-6">
      {/* CTA */}
      <div className="bg-slate-900 rounded-xl p-5 text-white">
        <p className="text-orange-400 font-bold text-xs mb-1">キャッシュバック実施中</p>
        <p className="font-black text-base leading-snug mb-1">NURO光</p>
        <p className="text-slate-300 text-xs mb-4">
          戸建て最大<span className="text-orange-400 font-black">{NURO.cashback.house}</span>
          <br />マンション最大<span className="text-orange-400 font-black">{NURO.cashback.mansion}</span>
        </p>
        <Link
          href={AFFILIATE_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-center py-2.5 rounded-lg transition-colors text-sm"
        >
          公式サイトへ →
        </Link>
      </div>

      {/* Recent articles */}
      {others.length > 0 && (
        <div>
          <p className="font-black text-slate-900 text-sm mb-3 pb-2 border-b border-slate-200">最新記事</p>
          <ul className="space-y-3">
            {others.map((article) => {
              const emoji = CATEGORY_EMOJI[article.category] ?? "⚡";
              return (
                <li key={article.slug}>
                  <Link href={`/blog/${article.slug}/`} className="flex gap-3 group">
                    <div className="relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden bg-slate-100">
                      {article.thumbnail ? (
                        <Image
                          src={article.thumbnail}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-orange-50">
                          <span className="text-xl">{emoji}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {article.title}
                      </p>
                      <time className="text-xs text-slate-400 mt-0.5 block" dateTime={article.publishedAt}>
                        {formatDate(article.publishedAt)}
                      </time>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href="/blog/" className="block text-center text-xs text-orange-500 font-bold mt-4 hover:underline">
            記事一覧をみる →
          </Link>
        </div>
      )}

      {/* Categories */}
      <div>
        <p className="font-black text-slate-900 text-sm mb-3 pb-2 border-b border-slate-200">カテゴリ</p>
        <ul className="space-y-1">
          {CATEGORIES.map((cat) => {
            const emoji = CATEGORY_EMOJI[cat.slug] ?? "⚡";
            return (
              <li key={cat.slug}>
                <Link
                  href={`/blog/?category=${cat.slug}`}
                  className="flex items-center gap-2 text-sm text-slate-700 hover:text-orange-600 py-1 transition-colors"
                >
                  <span>{emoji}</span>
                  <span className="font-bold">{cat.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Diagnosis link */}
      <div className="border border-orange-200 rounded-xl p-4 bg-orange-50 text-center">
        <p className="text-sm font-black text-slate-900 mb-1">乗り換え診断</p>
        <p className="text-xs text-slate-600 mb-3">3つの質問で最適なプランを診断</p>
        <Link
          href="/diagnosis/"
          className="block bg-white border border-orange-400 text-orange-600 font-bold text-xs py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
        >
          無料で診断する →
        </Link>
      </div>
    </aside>
  );
}
