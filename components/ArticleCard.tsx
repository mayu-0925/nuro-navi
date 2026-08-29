import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/date";
import { CATEGORIES } from "@/lib/data";

export default function ArticleCard({ article }: { article: Article }) {
  const categoryLabel = CATEGORIES.find((c) => c.slug === article.category)?.label ?? article.category;

  return (
    <Link href={`/blog/${article.slug}/`} className="group block">
      <article className="border border-slate-200 rounded-xl p-5 hover:border-orange-300 hover:shadow-sm transition-all h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded">
            {categoryLabel}
          </span>
          <time className="text-xs text-slate-400" dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
        </div>
        <h2 className="font-black text-slate-900 text-base leading-snug group-hover:text-orange-600 transition-colors mb-2 line-clamp-2">
          {article.title}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 flex-1">
          {article.description}
        </p>
        <p className="text-xs text-orange-500 font-bold mt-3">続きを読む →</p>
      </article>
    </Link>
  );
}
