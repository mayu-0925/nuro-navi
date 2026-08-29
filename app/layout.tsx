import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, BASE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: "NURO光の速度・料金・キャッシュバックを実測データで解説。乗り換えを検討している方向けの専門メディアです。",
  metadataBase: new URL(BASE_URL),
  openGraph: { siteName: SITE_NAME, locale: "ja_JP", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXXXX');`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
