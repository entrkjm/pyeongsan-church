# 빠른 시작 가이드 - 가장 쉬운 것부터

## 🎯 현재 상태
- ✅ Next.js 프로젝트 완성
- ✅ 모든 컴포넌트 구현 완료
- ⏳ 아직 배포 전

---

## 📝 Step 1: Vercel에 배포하기 (가장 쉬움, 10분)

### 1.1 Vercel 계정 생성
1. https://vercel.com 접속
2. "Sign Up" 클릭
3. GitHub 계정으로 로그인 (또는 이메일)

### 1.2 프로젝트 배포
1. Vercel 대시보드에서 "Add New Project" 클릭
2. GitHub 저장소 선택 (또는 GitLab, Bitbucket)
3. 프로젝트 설정:
   - **Framework Preset**: Next.js (자동 감지)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build` (자동)
   - **Output Directory**: `.next` (자동)
4. "Deploy" 클릭

### 1.3 완료!
- 배포 완료 후 자동으로 URL 제공 (예: `pyeongsan-church.vercel.app`)
- HTTPS 자동 적용
- Git 푸시 시 자동 재배포

### 필요한 것
- ✅ GitHub 계정 (또는 GitLab, Bitbucket)
- ✅ 프로젝트를 Git 저장소에 푸시

---

## 📝 Step 2: 기본 SEO 설정 (쉬움, 15분)

### 2.1 메타 태그 추가

`app/layout.tsx` 파일 수정:

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '무안 평산교회 - 믿음, 소망, 사랑의 공동체',
  description: '전남 무안군 현경면에 위치한 기독교대한성결교회 소속 무안 평산교회입니다. 함께 모여 예배드리고 사랑을 나누는 공동체입니다.',
  keywords: ['무안', '평산교회', '기독교', '예배', '무안군', '교회'],
  openGraph: {
    title: '무안 평산교회',
    description: '믿음, 소망, 사랑의 공동체 무안 평산교회',
    type: 'website',
    locale: 'ko_KR',
  },
}
```

### 2.2 sitemap.xml 생성

`app/sitemap.ts` 파일 생성:

```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://your-domain.com', // 실제 도메인으로 변경
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}
```

### 2.3 robots.txt 생성

`app/robots.ts` 파일 생성:

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://your-domain.com/sitemap.xml', // 실제 도메인으로 변경
  }
}
```

---

## 📝 Step 3: Google Analytics 설정 (쉬움, 20분)

### 3.1 Google Analytics 계정 생성
1. https://analytics.google.com 접속
2. 계정 생성
3. 속성(Property) 생성
4. 측정 ID 복사 (예: `G-XXXXXXXXXX`)

### 3.2 Next.js에 Google Analytics 추가

`app/layout.tsx` 파일 수정:

```typescript
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`} // 측정 ID로 변경
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX'); // 측정 ID로 변경
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 3.3 환경 변수 사용 (선택사항, 더 안전)

`.env.local` 파일 생성:
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

`app/layout.tsx`에서 사용:
```typescript
const gaId = process.env.NEXT_PUBLIC_GA_ID
```

---

## 📝 Step 4: 도메인 연결 (중간 난이도, 30분)

### 4.1 도메인 구매
- **추천 사이트**:
  - 가비아: https://www.gabia.com
  - 후이즈: https://whois.co.kr
  - Namecheap: https://www.namecheap.com
- **도메인 예시**: `pyeongsan-church.kr`, `pyeongsan-church.com`

### 4.2 Vercel에 도메인 추가
1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 도메인 입력 (예: `pyeongsan-church.kr`)
3. DNS 설정 안내 확인

### 4.3 DNS 설정
도메인 제공업체에서 DNS 레코드 추가:
- **Type**: CNAME
- **Name**: @ 또는 www
- **Value**: `cname.vercel-dns.com` (Vercel에서 제공)

---

## 📝 Step 5: Google Search Console 등록 (쉬움, 15분)

### 5.1 Google Search Console 접속
1. https://search.google.com/search-console 접속
2. 속성 추가 → URL 접두어 입력

### 5.2 소유권 확인
- **방법 1**: HTML 파일 업로드
- **방법 2**: DNS 레코드 추가 (도메인 연결 시)
- **방법 3**: HTML 태그 추가 (가장 쉬움)

### 5.3 sitemap 제출
- Sitemaps 메뉴에서 `sitemap.xml` 제출

---

## ✅ 체크리스트

### 즉시 할 수 있는 것 (오늘)
- [ ] Step 1: Vercel에 배포
- [ ] Step 2: 기본 SEO 설정
- [ ] Step 3: Google Analytics 설정

### 이번 주에 할 수 있는 것
- [ ] Step 4: 도메인 연결
- [ ] Step 5: Google Search Console 등록

### 나중에 할 것 (Admin 기능 추가 전)
- [ ] 이미지 최적화 확인
- [ ] 모바일 반응형 테스트
- [ ] 성능 최적화 (Lighthouse 점수 확인)

---

## 🚀 가장 빠른 시작 (5분 버전)

만약 지금 당장 배포만 하고 싶다면:

1. **GitHub에 푸시** (아직 안 했다면):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/pyeongsan-church.git
   git push -u origin main
   ```

2. **Vercel 배포**:
   - https://vercel.com 접속
   - "Add New Project" → GitHub 저장소 선택 → Deploy

3. **완료!** 🎉

---

## 📚 다음 단계 (Admin 기능 추가)

Admin 기능을 추가하려면:
1. Supabase 프로젝트 생성
2. 인증 시스템 구현
3. 데이터베이스 스키마 설계
4. Admin 대시보드 개발

하지만 지금은 **Step 1-3만 해도 충분**합니다!

---

**작성일**: 2024-12-09  
**프로젝트**: 무안 평산교회 웹사이트

