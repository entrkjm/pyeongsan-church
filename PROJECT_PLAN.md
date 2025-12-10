# 무안 평산교회 웹사이트 프로젝트 계획서

**최종 업데이트**: 2024-12-09  
**현재 상태**: 기본 웹사이트 완성, 배포 준비 완료

---

## 📋 프로젝트 개요

**목표**: 따뜻하고 신뢰감 있는 교회 웹사이트 제작  
**타겟**: 새신자/이주민, 기존 성도, 외부인  
**핵심 가치**: 화려함보다 따뜻함과 정보 전달  
**배포**: Vercel (Next.js 최적화)

---

## ✅ 완료된 작업

### Phase 1: 프로젝트 초기 설정 ✅
- [x] Next.js 프로젝트 생성 (App Router, TypeScript)
- [x] Tailwind CSS 설정
- [x] Framer Motion 설치
- [x] 기본 폴더 구조 생성
- [x] .cursorrules 파일 설정

### Phase 2: 디자인 시스템 구축 ✅
- [x] 컬러 팔레트 정의 (tailwind.config.ts)
- [x] 타이포그래피 설정 (Nanum Myeongjo 폰트)
- [x] 공통 컴포넌트 스타일 정의 (globals.css)
- [x] 반응형 브레이크포인트 설정

### Phase 3: 컴포넌트 개발 ✅
- [x] Navigation 컴포넌트 (글래스모피즘)
- [x] Hero 섹션 (풀스크린, 애니메이션)
- [x] About 섹션 (목사님 소개, 교회 특징)
- [x] WorshipTimes 섹션 (예배 시간 안내)
- [x] Location 섹션 (주소, 지도)
- [x] Gallery 섹션 (교회 행사 사진)
- [x] Footer 컴포넌트

### Phase 4: 배포 준비 ✅
- [x] Git 저장소 초기화 및 커밋
- [x] GitHub에 푸시 완료
- [x] SEO 기본 설정 (메타 태그, sitemap, robots.txt)
- [x] 프로젝트 문서화

---

## 🚀 현재 진행 상황

### 완성된 기능
- ✅ 반응형 웹사이트 (모바일 최우선)
- ✅ 모든 섹션 구현 완료
- ✅ 이미지 통합 완료
- ✅ 애니메이션 효과 적용
- ✅ SEO 기본 설정

### 배포 상태
- ✅ GitHub 저장소: https://github.com/entrkjm/pyeongsan-church
- ⏳ Vercel 배포: 준비 완료 (배포 대기 중)
- ⏳ 도메인 연결: 선택사항 (나중에 가능)

---

## 📐 사이트 구조

### Single Page Application (스크롤 방식)

1. **Hero Section**
   - 풀스크린 배경 이미지
   - 환영 메시지
   - CTA 버튼

2. **교회 소개 (About)**
   - 담임목사님 인사말 및 프로필
   - 교회 특징 (말씀 중심, 공동체, 사랑 실천)

3. **예배 안내 (WorshipTimes)** ⭐
   - 주일예배: 오전 11:00
   - 수요예배: 저녁 7:00 (겨울) / 8:00 (여름)
   - 새벽예배: 새벽 5:00

4. **오시는 길 (Location)**
   - 주소: 전남 무안군 현경면 함장로 84
   - Google Maps 연동
   - 교통 안내

5. **교회 갤러리 (Gallery)**
   - 교회 행사 사진
   - 반응형 그리드 레이아웃

6. **Footer**
   - 교회 정보
   - 연락처
   - 저작권 정보

---

## 🎨 디자인 시스템

### 컬러 팔레트
- **베이스**: 오프 화이트 (#f5f5f7)
- **텍스트**: 짙은 회색 (#1d1d1f)
- **강조색**: 보라색 계열 (기성 교단)
- **배경**: 화이트 & 베이지 톤

### 타이포그래피
- **폰트**: Nanum Myeongjo (세리프, 따뜻한 느낌)
- **크기**: 
  - 헤드라인: 48px~72px (모바일: 32px~48px)
  - 본문: 16px~18px (가독성 고려)

### 레이아웃 원칙
- 넓은 여백
- 둥근 모서리 (12px~16px)
- 부드러운 애니메이션

---

## 🛠 기술 스택

### 현재 사용 중
- **Framework**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **애니메이션**: Framer Motion
- **호스팅**: Vercel (예정)

### 추후 추가 예정 (Admin 기능)
- **백엔드**: Supabase (추천)
- **인증**: Supabase Auth
- **데이터베이스**: PostgreSQL (Supabase)
- **파일 스토리지**: Supabase Storage

---

## 📝 다음 단계

### 즉시 할 수 있는 것
1. **Vercel 배포** (10분)
   - Vercel 계정 생성
   - GitHub 저장소 연결
   - 자동 배포

2. **Google Analytics 설정** (20분)
   - GA4 계정 생성
   - 측정 ID 추가

3. **Google Search Console 등록** (15분)
   - 속성 추가
   - sitemap 제출

### 이번 주에 할 수 있는 것
4. **도메인 연결** (선택사항)
   - 도메인 구매
   - Vercel에 도메인 추가
   - DNS 설정

5. **성능 최적화 확인**
   - Lighthouse 점수 확인
   - 이미지 최적화 검토
   - 모바일 반응형 테스트

### 추후 추가 (Admin 기능)
6. **Supabase 프로젝트 생성**
7. **인증 시스템 구현**
8. **Admin 대시보드 개발**
9. **갤러리/소식 관리 기능**

---

## 💰 비용 예상

### 현재 (무료)
- **Vercel**: 무료 티어
- **GitHub**: 무료
- **도메인**: 선택사항 (약 15,000원/년)

### Admin 기능 추가 시
- **Vercel Pro**: $20/월 (트래픽 증가 시)
- **Supabase Pro**: $25/월 (트래픽 증가 시)
- **총 비용**: 초기 $0/월 → 성장 시 $45/월

---

## 📚 참고 문서

### 프로젝트 문서
- `QUICK_START.md`: 빠른 시작 가이드
- `DOMAIN_SETUP.md`: 도메인 설정 가이드
- `RECOMMENDATIONS.md`: 백엔드 솔루션 추천
- `CONSIDERATIONS.md`: Admin 기능 고려사항

### 외부 자료
- [Next.js 문서](https://nextjs.org/docs)
- [Vercel 문서](https://vercel.com/docs)
- [Supabase 문서](https://supabase.com/docs)

---

## 🎯 핵심 원칙

1. **모바일 최우선**: 90% 사용자가 모바일로 접속
2. **가독성**: 어르신들도 편하게 볼 수 있는 큰 글씨
3. **따뜻함**: 차가운 기술적 느낌 대신 평온함과 진정성
4. **정보 전달**: 핵심 정보(예배 시간, 위치)를 명확하게
5. **유지보수 용이**: 컴포넌트 기반 구조로 수정 용이

---

## 📅 프로젝트 타임라인

- **2024-12-09**: 프로젝트 시작, 모든 컴포넌트 완성
- **2024-12-09**: GitHub 푸시, 배포 준비 완료
- **진행 중**: Vercel 배포, SEO 설정
- **예정**: 도메인 연결, Google Analytics
- **추후**: Admin 기능 추가

---

**프로젝트 상태**: 기본 웹사이트 완성 ✅  
**다음 작업**: Vercel 배포
