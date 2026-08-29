import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleBody from "@/components/ArticleBody";
import CTABanner from "@/components/CTABanner";
import StickyBottomCTA from "@/components/StickyBottomCTA";
import { getArticleBySlug, getAllSlugs } from "@/lib/articles";
import { SITE_NAME, CATEGORIES } from "@/lib/data";
import { formatDate } from "@/lib/date";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} | ${SITE_NAME}`,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const categoryLabel = CATEGORIES.find((c) => c.slug === article.category)?.label ?? article.category;

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10 pb-28">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-400 mb-6 flex items-center gap-1.5">
          <a href="/" className="hover:text-orange-500">ホーム</a>
          <span>›</span>
          <a href="/blog/" className="hover:text-orange-500">記事一覧</a>
          <span>›</span>
          <span className="text-slate-600">{article.title}</span>
        </nav>

        {/* Article header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded">
              {categoryLabel}
            </span>
            <time className="text-xs text-slate-400" dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            {article.updatedAt && (
              <>
                <span className="text-xs text-slate-300">|</span>
                <time className="text-xs text-slate-400" dateTime={article.updatedAt}>
                  更新: {formatDate(article.updatedAt)}
                </time>
              </>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
            {article.title}
          </h1>
          <p className="text-slate-600 mt-3 leading-loose">{article.description}</p>
        </div>

        {/* Article body */}
        <ArticleBody blocks={article.body} />

        {/* Bottom CTA */}
        <div className="mt-12">
          <CTABanner />
        </div>
      </main>
      <Footer />
      <StickyBottomCTA />
    </>
  );
}
