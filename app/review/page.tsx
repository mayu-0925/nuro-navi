import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/CTABanner";
import StickyBottomCTA from "@/components/StickyBottomCTA";
import { SITE_NAME, NURO, AFFILIATE_URL } from "@/lib/data";
import Link from "next/link";

export const metadata: Metadata = {
  title: `NURO光 口コミ・評判・実測レビュー【${new Date().getFullYear()}年最新】 | ${SITE_NAME}`,
  description: "NURO光の実測速度・月額料金・工事日程・口コミ評判を徹底レビュー。フレッツ光やauひかりとの速度比較も掲載。",
};

export default function ReviewPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10 pb-28">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-4">
          NURO光 口コミ・評判・実測レビュー【{new Date().getFullYear()}年最新】
        </h1>
        <p className="text-slate-600 leading-loose mb-8">
          NURO光の実測速度・月額料金・キャンペーン・工事日程・口コミ評判を、実際の利用データをもとに徹底解説します。
        </p>

        <CTABanner variant="compact" />

        <div className="space-y-10 mt-10">
          <section>
            <h2 className="text-xl font-black text-slate-900 border-l-4 border-orange-500 pl-4 mb-5">基本スペック</h2>
            <dl className="space-y-0">
              {[
                { term: "月額料金", desc: `${NURO.price}（戸建て）` },
                { term: "最大速度", desc: NURO.speed },
                { term: "平均速度(下り)", desc: `${NURO.speedStats.down}Mbps` },
                { term: "平均速度(上り)", desc: `${NURO.speedStats.up}Mbps` },
                { term: "平均Ping", desc: `${NURO.speedStats.ping}ms` },
                { term: "キャッシュバック", desc: `戸建て${NURO.cashback.house}・マンション${NURO.cashback.mansion}` },
              ].map((row) => (
                <div key={row.term} className="flex gap-4 py-3 border-b border-slate-200 last:border-0">
                  <dt className="font-bold text-slate-900 text-base w-36 flex-shrink-0">{row.term}</dt>
                  <dd className="text-base text-slate-700">{row.desc}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 border-l-4 border-orange-500 pl-4 mb-5">メリット・デメリット</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <p className="font-black text-green-800 mb-3">メリット</p>
                <ul className="space-y-2">
                  {[
                    "10Gbpsの超高速回線",
                    "平均速度が他社より圧倒的に速い",
                    "Ping値が低くオンラインゲームに最適",
                    "キャッシュバックが業界最高水準",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-green-800">
                      <span className="text-green-500 mt-0.5">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <p className="font-black text-red-800 mb-3">デメリット</p>
                <ul className="space-y-2">
                  {[
                    "工事まで1〜2ヶ月かかることも",
                    "提供エリアが都市圏に限られる",
                    "独自回線のため専用工事が必要",
                    "マンションは管理組合の許可が必要な場合あり",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-red-800">
                      <span className="text-red-500 mt-0.5">✗</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-900 border-l-4 border-orange-500 pl-4 mb-5">こんな人におすすめ</h2>
            <ul className="space-y-2">
              {[
                "現在の回線が遅くて困っている",
                "オンラインゲームや動画配信を快適に楽しみたい",
                "月額料金を抑えつつキャッシュバックも受け取りたい",
                "フレッツ光・ドコモ光・auひかりからの乗り換えを検討している",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-base text-slate-700">
                  <span className="text-orange-500 mt-1">✓</span>
                  <span className="leading-loose">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <CTABanner />
        </div>
      </main>
      <Footer />
      <StickyBottomCTA />
    </>
  );
}
