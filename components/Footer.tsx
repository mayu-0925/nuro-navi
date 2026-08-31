import Link from "next/link";
import { SITE_NAME, AFFILIATE_URL } from "@/lib/data";
import { currentYearMonth } from "@/lib/date";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-orange-400">⚡</span>
              <span className="font-black text-white">{SITE_NAME}</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              NURO光への乗り換えを検討している方向けに、速度・料金・キャッシュバックを実測データで解説する専門メディアです。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="font-bold text-white mb-2">コンテンツ</p>
              <ul className="space-y-1.5">
                <li><Link href="/review/" className="hover:text-white transition-colors">NURO光レビュー</Link></li>
                <li><Link href="/campaign/" className="hover:text-white transition-colors">キャンペーン情報</Link></li>
                <li><Link href="/blog/" className="hover:text-white transition-colors">記事一覧</Link></li>
                <li><Link href="/diagnosis/" className="hover:text-white transition-colors">乗り換え診断</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-2">サイト情報</p>
              <ul className="space-y-1.5">
                <li><Link href="/about/" className="hover:text-white transition-colors">このサイトについて</Link></li>
                <li><Link href="/privacy/" className="hover:text-white transition-colors">プライバシーポリシー</Link></li>
                <li><Link href="/disclaimer/" className="hover:text-white transition-colors">免責事項</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
          <p>当サイトはアフィリエイト広告を利用しています。{currentYearMonth()}時点の情報です。</p>
          <Link
            href={AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-orange-400 font-bold hover:text-orange-300 transition-colors"
          >
            NURO光 公式サイトへ →
          </Link>
        </div>
      </div>
    </footer>
  );
}
