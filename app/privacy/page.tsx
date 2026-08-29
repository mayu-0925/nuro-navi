import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_NAME } from "@/lib/data";

export const metadata: Metadata = {
  title: `プライバシーポリシー | ${SITE_NAME}`,
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-slate-900 mb-8">プライバシーポリシー</h1>
        <div className="space-y-8 text-base text-slate-700 leading-loose">
          <section>
            <h2 className="font-black text-slate-900 mb-2">個人情報の収集について</h2>
            <p>当サイトでは、お問い合わせフォームを通じてお名前・メールアドレス等の個人情報をお預かりする場合があります。取得した個人情報は、お問い合わせへの対応のみに使用します。</p>
          </section>
          <section>
            <h2 className="font-black text-slate-900 mb-2">アクセス解析ツールについて</h2>
            <p>当サイトではGoogleアナリティクス（GA4）を使用しています。トラフィックデータはCookieを通じて収集されており、個人を特定する情報は含まれません。</p>
          </section>
          <section>
            <h2 className="font-black text-slate-900 mb-2">アフィリエイトについて</h2>
            <p>当サイトはA8.netのアフィリエイトプログラムに参加しています。記事内のリンクを経由してお申し込みいただいた場合、当サイトに報酬が支払われることがあります。</p>
          </section>
          <section>
            <h2 className="font-black text-slate-900 mb-2">プライバシーポリシーの変更</h2>
            <p>当サイトは必要に応じてプライバシーポリシーを変更する場合があります。変更後は本ページに掲載します。</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
