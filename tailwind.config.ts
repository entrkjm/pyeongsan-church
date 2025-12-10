import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 따뜻한 오프 화이트 베이스
        base: {
          DEFAULT: "#f5f5f7",
          light: "#ffffff",
        },
        // 부드러운 텍스트 색상
        text: {
          DEFAULT: "#1d1d1f",
          light: "#6e6e73",
        },
        // 강조색 - 보라색 계열 (기성 교단)
        accent: {
          purple: "#8B5CF6",
          "purple-light": "#A78BFA",
        },
        // 따뜻한 골드/세이지 그린
        warm: {
          gold: "#D4AF37",
          "sage-green": "#9CAF88",
          terra: "#C17A5F",
        },
      },
      fontFamily: {
        sans: [
          "Nanum Myeongjo",
          "Noto Serif KR",
          "Gowun Batang",
          "Noto Sans KR",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "serif",
        ],
      },
      fontSize: {
        // 타이포그래피 계층
        "display": ["72px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-mobile": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "headline": ["48px", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "headline-mobile": ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "subhead": ["24px", { lineHeight: "1.4" }],
        "body": ["18px", { lineHeight: "1.6" }],
        "body-mobile": ["16px", { lineHeight: "1.6" }],
      },
      borderRadius: {
        "card": "16px",
        "card-sm": "12px",
      },
      spacing: {
        "gutter": "24px",
        "gutter-lg": "48px",
      },
    },
  },
  plugins: [],
};
export default config;

