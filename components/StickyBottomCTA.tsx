"use client";
import Link from "next/link";
import { AFFILIATE_URL, NURO } from "@/lib/data";

export default function StickyBottomCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-black text-slate-900 text-sm truncate">🎉 {NURO.name}</p>
          <p className="text-xs text-slate-500 truncate">戸建て最大{NURO.cashback.house}キャッシュバック中</p>
        </div>
        <Link
          href={AFFILIATE_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          onClick={() => {
            if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
              (window as any).gtag("event", "affiliate_click", { provider: "nuro", position: "sticky_bottom" });
            }
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white font-black text-sm px-5 py-2.5 rounded-lg transition-colors flex-shrink-0"
        >
          今すぐ申し込む →
        </Link>
      </div>
    </div>
  );
}
