import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_NAME, BASE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: `このサイトについて | ${SITE_NAME}`,
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-slate-900 mb-8">このサイトについて</h1>
        <div className="space-y-6 text-base text-slate-700 leading-loose">
          <p>
            「{SITE_NAME}」は、NURO光への乗り換えを検討している方向けに、速度・料金・キャッシュバック情報を実測データをもとに発信する専門メディアです。
          </p>
          <p>
            光回線選びは情報が多く複雑に感じることがあります。当サイトでは「本当に乗り換えて得をするのか」を中心に、実際の利用体験に基づいた情報をわかりやすくお届けします。
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <p className="font-bold text-slate-900 mb-2">広告に関するご案内</p>
            <p>
              当サイトはアフィリエイト広告（A8.net）を利用しています。記事内のリンクからお申し込みいただいた場合、当サイトに報酬が発生することがあります。掲載内容はユーザーの利益を最優先に作成しており、広告収益によってコンテンツの客観性が損なわれることはありません。
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
