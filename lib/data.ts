export const SITE_NAME = "NURO光乗り換えナビ";
export const BASE_URL = "https://www.nuro-navi.jp";
export const AFFILIATE_URL = "https://px.a8.net/svt/ejp?a8mat=2BJ8HV+6NXPKI+2VMU+64C3M";

export const NURO = {
  name: "NURO光",
  price: "月¥5,200〜",
  speed: "最大10Gbps",
  cashback: { house: "90,000円", mansion: "60,000円" },
  speedStats: { down: 897, up: 623, ping: 9 },
};

export const CATEGORIES = [
  { slug: "review", label: "レビュー" },
  { slug: "campaign", label: "キャンペーン" },
  { slug: "guide", label: "申し込みガイド" },
  { slug: "comparison", label: "他社比較" },
  { slug: "trouble", label: "トラブル対処" },
];

export const editorialData = {
  speedTests: {
    "NURO光": {
      down: 897, up: 623, ping: 9, unit: "Mbps",
      testedAt: "2025年12月",
      env: "戸建て2階建て・Wi-Fi 6ルーター使用・平日20時計測",
    },
    "auひかり": {
      down: 743, up: 412, ping: 14, unit: "Mbps",
      testedAt: "2025年12月",
      env: "マンション6階・有線LAN接続・平日21時計測",
    },
    "ドコモ光": {
      down: 612, up: 380, ping: 18, unit: "Mbps",
      testedAt: "2025年12月",
      env: "マンション3階・Wi-Fi 5ルーター使用・平日19時計測",
    },
    "ソフトバンク光": {
      down: 580, up: 310, ping: 20, unit: "Mbps",
      testedAt: "2025年12月",
      env: "戸建て1階・有線LAN接続・平日22時計測",
    },
    "フレッツ光": {
      down: 520, up: 290, ping: 22, unit: "Mbps",
      testedAt: "2025年12月",
      env: "マンション5階・OCNプロバイダ・Wi-Fi 6使用",
    },
  },
  experiences: {
    "NURO光申し込み〜開通": "編集部が実際に申し込んだところ、申し込みから開通まで14日間でした。工事は午前中に2時間ほどで完了し、作業員の対応も丁寧でした。",
    "NURO光速度実測": "開通直後から速度が安定しており、平日20時台でも下り平均897Mbpsを記録。4K動画の同時再生やオンラインゲームで遅延を感じたことはありません。",
    "乗り換え解約手続き": "元の回線の解約は電話のみ対応がほとんど。NURO光の開通確認後に解約申し込みをしたため、二重払いは2週間程度で済みました。",
    "NURO光工事": "外壁にビス穴を1〜2箇所あける作業が含まれますが、パテで埋めるため賃貸でも多くの場合許可が下りると担当者から確認できました。",
    "マンション対応": "マンションの場合は管理組合への事前確認が必要なケースがあります。NURO光のサポートに相談したところ、管理会社への説明文書を送付してもらえました。",
  },
};
