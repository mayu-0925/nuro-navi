import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/articles";
import { SITE_NAME, CATEGORIES } from "@/lib/data";

export const metadata: Metadata = {
  title: `記事一覧 | ${SITE_NAME}`,
  description: "NURO光に関する記事一覧。速度・料金・乗り換え方法・他社比較など情報満載。",
};

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-slate-900 mb-8">記事一覧</h1>

        {/* Category filter (static links) */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="border border-orange-400 text-orange-600 text-sm font-bold px-4 py-1.5 rounded-full bg-orange-50">
            すべて
          </span>
          {CATEGORIES.map((cat) => (
            <a
              key={cat.slug}
              href={`?category=${cat.slug}`}
              className="border border-slate-200 hover:border-orange-300 text-slate-700 text-sm font-bold px-4 py-1.5 rounded-full transition-colors"
            >
              {cat.label}
            </a>
          ))}
        </div>

        {articles.length === 0 ? (
          <p className="text-slate-500 py-10 text-center">記事はまだありません。</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
