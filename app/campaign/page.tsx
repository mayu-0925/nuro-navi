import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CTABanner from "@/components/CTABanner";
import StickyBottomCTA from "@/components/StickyBottomCTA";
import { SITE_NAME, NURO, AFFILIATE_URL } from "@/lib/data";
import { currentYearMonth } from "@/lib/date";

export const metadata: Metadata = {
  title: `NURO光 キャンペーン・キャッシュバック【${new Date().getFullYear()}年最新】 | ${SITE_NAME}`,
  description: "NURO光の最新キャンペーン情報をまとめました。戸建て最大90,000円・マンション最大60,000円のキャッシュバック詳細を解説。",
};

export default function CampaignPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10 pb-28">
        <p className="text-xs text-slate-400 mb-2">{currentYearMonth()}時点の情報</p>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-4">
          NURO光 キャンペーン・キャッシュバック最新情報
        </h1>
        <p className="text-slate-600 leading-loose mb-8">
          現在実施中のNURO光公式キャンペーンをまとめています。キャッシュバック金額・条件・受け取り方法を詳しく解説します。
        </p>

        <div className="space-y-8">
          {/* Main cashback */}
          <section className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <p className="text-orange-600 font-bold text-sm mb-2">メインキャンペーン</p>
            <h2 className="text-2xl font-black text-slate-900 mb-4">キャッシュバックキャンペーン</h2>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-white rounded-xl p-4 text-center border border-orange-200">
                <p className="text-3xl font-black text-orange-500">{NURO.cashback.house}</p>
                <p className="text-sm text-slate-600 mt-1">戸建て</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-orange-200">
                <p className="text-3xl font-black text-orange-500">{NURO.cashback.mansion}</p>
                <p className="text-sm text-slate-600 mt-1">マンション</p>
              </div>
            </div>
            <ul className="space-y-2 mb-5">
              {[
                "新規申し込みが対象",
                "工事完了後から適用",
                "キャッシュバックは振込で受け取り",
                "当サイト経由の申し込みが条件",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-orange-500 mt-0.5">✓</span>{item}
                </li>
              ))}
            </ul>
            <Link
              href={AFFILIATE_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-center py-4 rounded-xl transition-colors"
            >
              キャンペーンを確認する →
            </Link>
          </section>

          {/* How to receive */}
          <section>
            <h2 className="text-xl font-black text-slate-900 border-l-4 border-orange-500 pl-4 mb-5">
              キャッシュバックの受け取り方法
            </h2>
            <ol className="space-y-4">
              {[
                "当サイトのリンクからNURO光公式サイトにアクセス",
                "申し込みフォームに必要事項を入力",
                "工事日程を調整・工事完了",
                "指定の期間内にキャッシュバック申請",
                "口座へ振込",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 text-white text-sm font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-base text-slate-700 leading-loose pt-0.5">{item}</span>
                </li>
              ))}
            </ol>
          </section>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <p className="text-sm text-slate-700 leading-loose">
              ⚠️ キャッシュバックの金額・条件は予告なく変更になる場合があります。申し込み前に必ず公式サイトでご確認ください。
            </p>
          </div>

          <CTABanner />
        </div>
      </main>
      <Footer />
      <StickyBottomCTA />
    </>
  );
}
