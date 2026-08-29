import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_NAME } from "@/lib/data";

export const metadata: Metadata = {
  title: `お問い合わせ | ${SITE_NAME}`,
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-black text-slate-900 mb-4">お問い合わせ</h1>
        <p className="text-slate-600 leading-loose mb-8">
          掲載内容に関するご指摘・ご質問は、以下のメールアドレスまでご連絡ください。
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <p className="font-bold text-slate-900">メールでのお問い合わせ</p>
          <p className="text-slate-600 mt-2">mayu925@gmail.com</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
