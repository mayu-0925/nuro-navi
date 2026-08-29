import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import CTABanner from "@/components/CTABanner";
import { getAllArticles } from "@/lib/articles";
import { SITE_NAME, NURO, AFFILIATE_URL, CATEGORIES } from "@/lib/data";

export const metadata: Metadata = {
  title: `${SITE_NAME} | NURO光の速度・料金・キャッシュバックを実測データで解説`,
  description: "NURO光の速度・料金・キャッシュバックを実測データで解説。フレッツ光・auひかり・ドコモ光との比較も掲載。乗り換え前に知っておきたい情報をまとめた専門メディアです。",
};

export default function HomePage() {
  const articles = getAllArticles();
  const featuredArticles = articles.slice(0, 3);
  const recentArticles = articles.slice(3);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-orange-600 font-bold text-sm mb-3">キャッシュバック最大90,000円</p>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
              NURO光に乗り換えるなら<br />
              <span className="text-orange-500">知っておくべきこと</span>、全部ここに
            </h1>
            <p className="text-slate-600 leading-loose mb-8 max-w-xl mx-auto">
              速度・料金・工事・キャッシュバック…乗り換え前の疑問を実測データと口コミで解決します。
            </p>
            <Link
              href={AFFILIATE_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-4 rounded-xl text-lg transition-colors"
            >
              NURO光の公式サイトへ →
            </Link>
          </div>
        </section>

        {/* Specs at a glance */}
        <section className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-xl font-black text-slate-900 mb-5">NURO光 基本スペック</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "月額料金", value: NURO.price },
              { label: "最大速度", value: NURO.speed },
              { label: "平均速度（下り）", value: `${NURO.speedStats.down}Mbps` },
              { label: "平均Ping", value: `${NURO.speedStats.ping}ms` },
            ].map((s) => (
              <div key={s.label} className="border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-orange-500 font-black text-2xl">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Category nav */}
        <section className="max-w-5xl mx-auto px-4 pb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/?category=${cat.slug}`}
                className="border border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-700 text-sm font-bold px-4 py-1.5 rounded-full transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Featured articles */}
        {featuredArticles.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 pb-10">
            <h2 className="text-xl font-black text-slate-900 mb-5">注目記事</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-4 pb-10">
          <CTABanner />
        </section>

        {/* More articles */}
        {recentArticles.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 pb-10">
            <h2 className="text-xl font-black text-slate-900 mb-5">新着記事</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {recentArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* All articles link */}
        <div className="text-center pb-12">
          <Link
            href="/blog/"
            className="inline-block border border-slate-300 hover:border-orange-400 text-slate-700 font-bold px-6 py-3 rounded-xl transition-colors"
          >
            記事一覧をみる →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
