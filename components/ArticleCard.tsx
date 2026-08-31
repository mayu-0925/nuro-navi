import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/date";
import { CATEGORIES } from "@/lib/data";

const CATEGORY_EMOJI: Record<string, string> = {
  review: "⭐",
  campaign: "🎁",
  guide: "📖",
  comparison: "⚖️",
  trouble: "🔧",
};

export default function ArticleCard({ article }: { article: Article }) {
  const categoryLabel = CATEGORIES.find((c) => c.slug === article.category)?.label ?? article.category;
  const emoji = CATEGORY_EMOJI[article.category] ?? "⚡";

  return (
    <Link href={`/blog/${article.slug}/`} className="group block">
      <article className="border border-slate-200 rounded-xl overflow-hidden hover:border-orange-300 hover:shadow-md transition-all h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative w-full aspect-video bg-slate-100 flex-shrink-0">
          {article.thumbnail ? (
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-orange-50">
              <span className="text-4xl mb-1">{emoji}</span>
              <span className="text-xs font-bold text-orange-400">{categoryLabel}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded">
              {categoryLabel}
            </span>
            <time className="text-xs text-slate-400" dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
          </div>
          <h2 className="font-black text-slate-900 text-sm leading-snug group-hover:text-orange-600 transition-colors mb-2 line-clamp-2">
            {article.title}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
            {article.description}
          </p>
          <p className="text-xs text-orange-500 font-bold mt-3">続きを読む →</p>
        </div>
      </article>
    </Link>
  );
}
