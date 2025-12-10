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
        // 강조색 - 따뜻한 톤 (가독성 확보)
        accent: {
          primary: "#5D4E37", // 진한 카멜 브라운 (흰색 텍스트 대비 확보)
          "primary-light": "#6B5A47", // 중간 톤
          "primary-dark": "#4A3D2B", // 더 진한 톤
        },
        // 에러/경고 색상 - 부드러운 톤
        error: {
          DEFAULT: "#FCA5A5", // 부드러운 살몬
          light: "#FECACA", // 더 밝은 살몬
          dark: "#F87171", // 약간 진한 살몬
          bg: "#FEF2F2", // 배경용
          border: "#FECACA", // 테두리용
          text: "#991B1B", // 텍스트용
        },
        // 성공 색상
        success: {
          DEFAULT: "#86EFAC", // 부드러운 민트
          light: "#A7F3D0",
          dark: "#4ADE80",
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

