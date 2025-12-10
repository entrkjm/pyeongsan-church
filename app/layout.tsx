import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "평산성결교회 - 믿음, 소망, 사랑의 공동체",
  description: "전남 무안군 현경면에 위치한 기독교대한성결교회 소속 평산성결교회입니다. 함께 모여 예배드리고 사랑을 나누는 공동체입니다.",
  keywords: ["무안", "평산성결교회", "기독교", "예배", "무안군", "교회", "기독교대한성결교회"],
  openGraph: {
    title: "평산성결교회",
    description: "믿음, 소망, 사랑의 공동체 평산성결교회",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* Source Han Serif KR - 로컬 폰트 파일 사용 */}
      </head>
      <body>{children}</body>
    </html>
  );
}

