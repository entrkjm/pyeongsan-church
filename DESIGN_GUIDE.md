# 무안 평산교회 웹사이트 디자인 가이드

**최종 업데이트**: 2024-12-09  
**목적**: 일관된 디자인 시스템 유지 및 새로운 컴포넌트 개발 시 참고

---

## 🎨 디자인 철학

### 핵심 원칙
1. **따뜻함과 진정성**: 차가운 기술적 느낌 대신 평온함과 진정성
2. **모바일 최우선**: 90% 사용자가 모바일로 접속
3. **가독성**: 어르신들도 편하게 볼 수 있는 큰 글씨
4. **넓은 여백**: Apple 스타일의 넓은 여백으로 시원하고 여유로운 느낌
5. **미니멀리즘**: 불필요한 장식 제거, 핵심에 집중

---

## 🎨 컬러 시스템

### 기본 색상

#### 배경색
```css
/* 베이스 배경 */
bg-base          #f5f5f7  /* 오프 화이트 */
bg-base-light    #ffffff  /* 순수 화이트 */

/* 섹션 배경 */
bg-[#fafafa]     /* Navigation 배경 */
bg-[#f0f0f0]     /* Footer 배경 */
```

#### 텍스트 색상
```css
text-text        #1d1d1f  /* 메인 텍스트 (검정 금지!) */
text-text-light  #6e6e73  /* 보조 텍스트 */
```

### 강조 색상 (버튼, 링크)

#### 메인 버튼 (Primary)
```css
/* 배경 */
backgroundColor: '#E8E0D6'  /* 베이지/크림 파스텔 */
/* 텍스트 */
color: '#5D4E37'           /* 갈색 */

/* 호버 상태 */
backgroundColor: '#D4C4B0'  /* 더 진한 베이지 */
```

#### 보조 버튼 (Secondary - 로그아웃, 삭제)
```css
/* 배경 */
backgroundColor: '#F5E6D3'  /* 밝은 베이지 */
/* 텍스트 */
color: '#8B6F47'           /* 갈색 */

/* 호버 상태 */
backgroundColor: '#E8D4B8'  /* 더 진한 베이지 */
```

### 에러/경고 색상
```css
error-bg      #FEF2F2  /* 배경 */
error-border  #FECACA  /* 테두리 */
error-text    #991B1B  /* 텍스트 */
```

### 금지 색상
❌ **절대 사용 금지**:
- 빨간색 (#FF0000, #DC2626 등 원색)
- 보라색 (#8B5CF6, #A78BFA 등 원색)
- 파란색 (#3B82F6 등 원색)
- 완전한 검정 (#000000)
- 채도 높은 원색 전반

✅ **사용 가능**: 파스텔 톤, 따뜻한 톤, 중성 회색

---

## 📐 라운드 처리 (Border Radius)

### 규칙
```css
/* 버튼 */
rounded-md    /* 6px - 모든 버튼에 적용 */

/* 카드/컨테이너 */
rounded-lg    /* 8px - 카드, 폼, 입력 필드 */

/* 이미지 */
rounded-lg    /* 8px - 이미지 컨테이너 */
```

### 사용 예시
```tsx
// 버튼
<button className="rounded-md ...">버튼</button>

// 카드
<div className="bg-white rounded-lg ...">카드</div>

// 입력 필드
<input className="rounded-lg ..." />
```

---

## ✍️ 타이포그래피

### 폰트
```css
font-family: "Nanum Myeongjo", "Noto Serif KR", "Gowun Batang", 
             "Noto Sans KR", "-apple-system", "BlinkMacSystemFont", 
             "system-ui", "serif"
```

### 폰트 크기

#### 메인 페이지
```css
/* 헤드라인 */
text-5xl md:text-7xl    /* 섹션 제목 */
text-3xl md:text-4xl    /* 서브 헤드라인 */
text-2xl md:text-3xl    /* 설명 텍스트 */

/* 본문 */
text-body               /* 18px - 데스크탑 */
text-body-mobile        /* 16px - 모바일 */
```

#### Admin 페이지
```css
/* 제목 */
text-3xl                /* 페이지 제목 */
text-2xl                /* 섹션 제목 */
text-xl                 /* 카드 제목 */

/* 본문 */
text-base               /* 16px - 기본 */
text-sm                 /* 14px - 보조 텍스트 */
```

### 폰트 굵기
```css
font-bold               /* 버튼, 제목 */
font-semibold           /* 강조 텍스트 */
font-medium              /* 일반 텍스트 */
font-normal              /* 기본 */
```

---

## 📦 컴포넌트 스타일 가이드

### 버튼

#### Primary Button (메인 액션)
```tsx
<button
  className="px-6 py-3.5 rounded-md font-bold transition-all duration-200 shadow-sm hover:shadow-md"
  style={{ backgroundColor: '#E8E0D6', color: '#5D4E37' }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#D4C4B0';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = '#E8E0D6';
  }}
>
  버튼 텍스트
</button>
```

#### Secondary Button (보조 액션)
```tsx
<button
  className="px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 shadow-sm hover:shadow"
  style={{ backgroundColor: '#F5E6D3', color: '#8B6F47' }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#E8D4B8';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = '#F5E6D3';
  }}
>
  버튼 텍스트
</button>
```

### 카드

#### 기본 카드
```tsx
<div className="bg-white rounded-lg shadow-sm p-8 border border-text/5 hover:shadow-lg transition-all duration-200">
  {/* 카드 내용 */}
</div>
```

#### Admin 카드
```tsx
<motion.div
  whileHover={{ scale: 1.01, y: -2 }}
  className="bg-white rounded-lg shadow-sm p-8 border border-text/5 hover:shadow-lg transition-all duration-200"
>
  {/* 카드 내용 */}
</motion.div>
```

### 입력 필드

```tsx
<input
  className="w-full px-4 py-3 border border-text/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary/50 text-text bg-white transition-all"
  type="text"
/>
```

### 에러 메시지

```tsx
<div className="bg-error-bg border border-error-border rounded-md p-4">
  <p className="text-error-text text-sm">에러 메시지</p>
</div>
```

---

## 📏 여백 (Spacing)

### 섹션 여백
```css
/* 섹션 상하 여백 */
py-16 md:py-20    /* 메인 섹션 */
py-12              /* Admin 섹션 */

/* 섹션 좌우 여백 */
section-container  /* 최대 너비 + 자동 여백 */
px-4 md:px-6       /* 내부 여백 */
```

### 컴포넌트 간 여백
```css
gap-6              /* 카드 그리드 */
gap-4              /* 작은 요소 간격 */
space-y-6          /* 세로 스택 */
```

---

## 🎭 그림자 (Shadow)

### 사용 규칙
```css
shadow-sm          /* 기본 카드 */
shadow-md          /* 호버 시 */
shadow-lg          /* 강조 카드 */
shadow-xl          /* 모달, 중요 카드 */
```

### 예시
```tsx
// 기본
<div className="shadow-sm hover:shadow-lg transition-all duration-200">
```

---

## 🎬 애니메이션

### Framer Motion 사용

#### 페이드 인 + 위로 이동
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

#### 스크롤 기반 애니메이션
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>
```

#### 호버 효과
```tsx
<motion.button
  whileHover={{ scale: 1.01, y: -1 }}
  whileTap={{ scale: 0.99 }}
>
```

### 전환 효과
```css
transition-all duration-200    /* 기본 */
transition-colors duration-200 /* 색상만 */
```

---

## 📱 반응형 디자인

### 브레이크포인트
```css
/* 모바일 우선 접근 */
기본: 모바일 스타일
md:  768px 이상 (태블릿/데스크탑)
lg:  1024px 이상 (데스크탑)
```

### 예시
```tsx
<div className="
  text-2xl md:text-4xl        /* 폰트 크기 */
  px-4 md:px-8                /* 좌우 여백 */
  py-8 md:py-12               /* 상하 여백 */
  grid-cols-1 md:grid-cols-2  /* 그리드 */
">
```

---

## 🚫 금지 사항

### 절대 사용하지 말 것
1. ❌ 채도 높은 원색 (빨강, 파랑, 보라 등)
2. ❌ 완전한 검정 (#000000)
3. ❌ 작은 글씨 (14px 미만)
4. ❌ 과도한 라운드 처리 (rounded-2xl 이상)
5. ❌ 강한 그림자 (shadow-2xl)
6. ❌ 빠르거나 현란한 애니메이션
7. ❌ 복잡한 그라데이션
8. ❌ 이모지 사용

### 반드시 포함할 것
1. ✅ 모바일 반응형
2. ✅ 넓은 여백
3. ✅ 큰 글씨 (16px 이상)
4. ✅ 부드러운 애니메이션
5. ✅ 파스텔 톤 색상
6. ✅ 적절한 라운드 처리 (rounded-md, rounded-lg)
7. ✅ TypeScript 타입 정의
8. ✅ 접근성 고려 (alt 텍스트, 시맨틱 HTML)

---

## 📋 컴포넌트 개발 체크리스트

새로운 컴포넌트를 만들 때 다음을 확인하세요:

### 디자인
- [ ] 파스텔 톤 색상 사용 (빨강/보라 금지)
- [ ] 버튼: rounded-md, 파스텔 베이지 배경
- [ ] 카드: rounded-lg, shadow-sm
- [ ] 넓은 여백 적용
- [ ] 큰 글씨 (16px 이상)

### 반응형
- [ ] 모바일 우선 디자인
- [ ] md: 브레이크포인트 적용
- [ ] 터치 친화적 크기

### 애니메이션
- [ ] Framer Motion 사용
- [ ] 부드러운 전환 (duration-200)
- [ ] 과도하지 않은 효과

### 접근성
- [ ] 시맨틱 HTML
- [ ] alt 텍스트 (이미지)
- [ ] 키보드 네비게이션 가능

### 코드 품질
- [ ] TypeScript 타입 정의
- [ ] 컴포넌트 모듈화
- [ ] 재사용 가능한 구조

---

## 📚 참고 파일

- `tailwind.config.ts`: 색상, 폰트, 크기 정의
- `.cursorrules`: 전체 프로젝트 가이드
- `components/`: 기존 컴포넌트 참고
- `app/admin/`: Admin 페이지 스타일 참고

---

## 🎯 Admin 페이지 특별 규칙

### 버튼 색상
- **메인 액션**: `#E8E0D6` 배경, `#5D4E37` 텍스트
- **보조 액션**: `#F5E6D3` 배경, `#8B6F47` 텍스트

### 카드 스타일
- `rounded-lg` (rounded-2xl 금지)
- `shadow-sm` 기본, `hover:shadow-lg`
- `border border-text/5`

### 입력 필드
- `rounded-lg`
- `border-text/10`
- 포커스: `ring-accent-primary/30`

---

**이 가이드를 항상 참고하여 일관된 디자인을 유지하세요!**

