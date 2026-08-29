import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_NAME } from "@/lib/data";

export const metadata: Metadata = {
  title: `免責事項 | ${SITE_NAME}`,
};

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-slate-900 mb-8">免責事項</h1>
        <div className="space-y-6 text-base text-slate-700 leading-loose">
          <p>
            当サイトに掲載している情報は、執筆時点において正確な情報の提供に努めていますが、内容の完全性・正確性を保証するものではありません。掲載している料金・キャンペーン情報は予告なく変更になる場合があります。必ず公式サイトで最新情報をご確認ください。
          </p>
          <p>
            当サイトを利用したことにより生じた損害について、運営者はいかなる責任も負いかねます。
          </p>
          <p>
            当サイトからリンクしている外部サイトの内容については、当サイトは責任を負いません。
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
