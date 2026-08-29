import Link from "next/link";
import { AFFILIATE_URL } from "@/lib/data";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-orange-500 text-xl">⚡</span>
          <span className="font-black text-slate-900 text-base leading-tight">
            NURO光<br className="hidden sm:block" />
            <span className="text-sm font-bold text-slate-500">乗り換えナビ</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm font-bold text-slate-600">
          <Link href="/review/" className="hover:text-orange-500 transition-colors">レビュー</Link>
          <Link href="/campaign/" className="hover:text-orange-500 transition-colors">キャンペーン</Link>
          <Link href="/blog/" className="hover:text-orange-500 transition-colors">記事一覧</Link>
          <Link href="/diagnosis/" className="hover:text-orange-500 transition-colors">乗り換え診断</Link>
        </nav>

        <Link
          href={AFFILIATE_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-black px-4 py-2 rounded-lg transition-colors flex-shrink-0"
        >
          申し込みはこちら
        </Link>
      </div>
    </header>
  );
}
