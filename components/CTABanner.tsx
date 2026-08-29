"use client";
import Link from "next/link";
import { AFFILIATE_URL, NURO } from "@/lib/data";

type Props = { variant?: "default" | "compact" };

export default function CTABanner({ variant = "default" }: Props) {
  if (variant === "compact") {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-black text-slate-900 text-base">NURO光 公式キャンペーン</p>
          <p className="text-sm text-slate-600 mt-0.5">戸建て最大90,000円キャッシュバック実施中</p>
        </div>
        <Link
          href={AFFILIATE_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          onClick={() => {
            if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
              (window as any).gtag("event", "affiliate_click", { provider: "nuro", position: "cta_banner_compact" });
            }
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-3 rounded-lg transition-colors text-sm whitespace-nowrap"
        >
          公式サイトで確認 →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white">
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-orange-500 text-white text-xs font-black px-2 py-0.5 rounded">PR</span>
        <span className="text-orange-400 font-bold text-sm">期間限定キャンペーン実施中</span>
      </div>
      <h3 className="text-2xl font-black mb-2">NURO光に乗り換えると</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <p className="text-orange-400 font-black text-2xl">{NURO.cashback.house}</p>
          <p className="text-xs text-slate-300 mt-0.5">戸建てキャッシュバック</p>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <p className="text-orange-400 font-black text-2xl">{NURO.cashback.mansion}</p>
          <p className="text-xs text-slate-300 mt-0.5">マンションキャッシュバック</p>
        </div>
        <div className="bg-white/10 rounded-lg p-3 text-center col-span-2 md:col-span-1">
          <p className="text-orange-400 font-black text-2xl">{NURO.speed}</p>
          <p className="text-xs text-slate-300 mt-0.5">最大通信速度</p>
        </div>
      </div>
      <Link
        href={AFFILIATE_URL}
        target="_blank"
        rel="noopener noreferrer nofollow"
        onClick={() => {
          if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
            (window as any).gtag("event", "affiliate_click", { provider: "nuro", position: "cta_banner_full" });
          }
        }}
        className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-center py-4 rounded-xl transition-colors text-lg"
      >
        NURO光の公式サイトで申し込む →
      </Link>
      <p className="text-xs text-slate-400 text-center mt-3">※当サイト経由でのみ適用されるキャンペーンがあります</p>
    </div>
  );
}
