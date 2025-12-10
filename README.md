# 무안 평산교회 웹사이트

따뜻하고 신뢰감 있는 교회 웹사이트

## 🚀 빠른 시작

### 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 배포

1. GitHub에 푸시 (이미 완료)
2. Vercel에서 배포: https://vercel.com
3. GitHub 저장소 연결
4. 자동 배포 완료

## 📁 프로젝트 구조

```
pyeongsan-church/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지
│   ├── globals.css        # 전역 스타일
│   ├── sitemap.ts         # SEO sitemap
│   └── robots.ts          # SEO robots.txt
├── components/             # 컴포넌트
│   ├── Navigation.tsx     # 네비게이션 바
│   ├── Hero.tsx           # 히어로 섹션
│   ├── About.tsx          # 교회 소개
│   ├── WorshipTimes.tsx   # 예배 안내
│   ├── Location.tsx        # 오시는 길
│   ├── Gallery.tsx        # 갤러리
│   └── Footer.tsx         # 푸터
├── public/                # 정적 파일
│   └── images/            # 이미지 파일
└── old/                   # 과거 문서 (참고용)
```

## 🛠 기술 스택

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**

## 📚 문서

- `PROJECT_PLAN.md`: 프로젝트 계획서 및 현재 상태
- `old/`: 과거 문서들 (참고용)

## 📝 다음 단계

1. Vercel 배포
2. Google Analytics 설정
3. Google Search Console 등록
4. 도메인 연결 (선택사항)

자세한 내용은 `PROJECT_PLAN.md` 참고

---

**GitHub**: https://github.com/entrkjm/pyeongsan-church

