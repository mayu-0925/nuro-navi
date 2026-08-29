"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AFFILIATE_URL } from "@/lib/data";

type Step = { question: string; options: { label: string; value: string }[] };

const STEPS: Step[] = [
  {
    question: "現在の住居タイプは？",
    options: [
      { label: "一戸建て", value: "house" },
      { label: "マンション・アパート", value: "mansion" },
    ],
  },
  {
    question: "現在の光回線契約は？",
    options: [
      { label: "フレッツ光（ドコモ光含む）", value: "flets" },
      { label: "auひかり", value: "au" },
      { label: "ソフトバンク光", value: "softbank" },
      { label: "未契約（新規）", value: "new" },
      { label: "その他", value: "other" },
    ],
  },
  {
    question: "月額料金の希望は？",
    options: [
      { label: "できるだけ安くしたい", value: "cheap" },
      { label: "多少高くても速い方がいい", value: "fast" },
      { label: "キャッシュバックが多い方がいい", value: "cashback" },
    ],
  },
];

export default function DiagnosisPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  function handleSelect(value: string) {
    const next = [...answers, value];
    setAnswers(next);
    if (step + 1 >= STEPS.length) {
      setDone(true);
    } else {
      setStep(step + 1);
    }
  }

  const cashback = answers[0] === "house" ? "90,000円" : "60,000円";

  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto px-4 py-14 pb-20 min-h-screen">
        <h1 className="text-2xl font-black text-slate-900 mb-2 text-center">NURO光 乗り換え診断</h1>
        <p className="text-slate-500 text-sm text-center mb-10">3つの質問に答えてあなたに合った情報を確認できます</p>

        {!done ? (
          <div>
            {/* Progress */}
            <div className="flex gap-1.5 mb-8">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full transition-colors ${
                    i <= step ? "bg-orange-500" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 mb-3">質問 {step + 1} / {STEPS.length}</p>
            <p className="text-xl font-black text-slate-900 mb-6">{STEPS[step].question}</p>
            <div className="space-y-3">
              {STEPS[step].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className="w-full text-left border border-slate-200 hover:border-orange-400 hover:bg-orange-50 rounded-xl px-5 py-4 font-bold text-slate-800 transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 mb-6">
              <p className="text-orange-600 font-bold text-sm mb-2">診断結果</p>
              <p className="text-2xl font-black text-slate-900 mb-2">NURO光がおすすめです</p>
              <p className="text-slate-600 leading-loose mb-4">
                あなたの条件では、最大<strong className="text-orange-500">{cashback}のキャッシュバック</strong>が受け取れます。
              </p>
              <Link
                href={AFFILIATE_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={() => {
                  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
                    (window as any).gtag("event", "affiliate_click", { provider: "nuro", position: "diagnosis_result" });
                  }
                }}
                className="block bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl transition-colors text-lg"
              >
                NURO光に申し込む →
              </Link>
            </div>
            <button
              onClick={() => { setStep(0); setAnswers([]); setDone(false); }}
              className="text-sm text-slate-400 hover:text-slate-600 underline"
            >
              もう一度診断する
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
