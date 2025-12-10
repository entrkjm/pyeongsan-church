# Admin 기능 및 게시판 개발 계획

**작성일**: 2024-12-09  
**목표**: Admin 관리자가 콘텐츠를 관리할 수 있는 시스템 구축

---

## 📋 요구사항 정리

### 핵심 기능
1. **Admin 인증 시스템**
   - Admin만 로그인 가능
   - 회원 기능은 불필요 (당장)

2. **갤러리 게시판**
   - Admin이 교회 행사 사진 업로드
   - 업로드된 사진이 메인 페이지 하단(Gallery 섹션)에 표시
   - 사진 삭제/수정 기능

3. **교회 공지 게시판**
   - Admin이 공지 작성
   - 공지 목록 표시
   - 공지 상세 보기

4. **댓글 기능**
   - 회원가입 없이 댓글 작성 가능 (익명 댓글)
   - 갤러리/공지에 댓글 달기

---

## 🏗 기술 스택

### 추천 솔루션: Vercel + Supabase

#### Vercel (이미 사용 중)
- Next.js 호스팅
- 서버리스 함수 지원
- 자동 배포

#### Supabase (추가 필요)
- **PostgreSQL 데이터베이스**: 게시물, 댓글 저장
- **인증 시스템**: Admin 로그인
- **파일 스토리지**: 이미지 업로드
- **실시간 기능**: 댓글 실시간 업데이트

---

## 📐 데이터베이스 스키마 설계

### 1. users 테이블 (Admin)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin', -- 'admin'만 사용
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. gallery 테이블 (갤러리)
```sql
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL, -- Supabase Storage URL
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);
```

### 3. notices 테이블 (공지)
```sql
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT, -- 선택적
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);
```

### 4. comments 테이블 (댓글)
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_type TEXT NOT NULL, -- 'gallery' or 'notice'
  post_id UUID NOT NULL, -- gallery.id or notices.id
  author_name TEXT, -- 익명 사용자 이름 (선택적)
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎨 UI/UX 설계

### Admin 대시보드
- **로그인 페이지**: `/admin/login`
- **대시보드**: `/admin/dashboard`
  - 갤러리 관리
  - 공지 관리
  - 통계 (선택적)

### 갤러리 관리
- **갤러리 목록**: `/admin/gallery`
  - 사진 목록 (그리드)
  - 업로드 버튼
  - 삭제/수정 기능

- **사진 업로드**: `/admin/gallery/upload`
  - 드래그 앤 드롭
  - 제목, 설명 입력
  - 미리보기

### 공지 관리
- **공지 목록**: `/admin/notices`
  - 공지 목록
  - 작성 버튼
  - 수정/삭제 기능

- **공지 작성/수정**: `/admin/notices/new`, `/admin/notices/[id]/edit`
  - 제목, 본문 입력
  - 이미지 업로드 (선택적)
  - WYSIWYG 에디터 (선택적)

### 공개 페이지
- **메인 페이지 갤러리 섹션**: 기존 `Gallery.tsx` 수정
  - Supabase에서 갤러리 데이터 가져오기
  - 최신순 정렬

- **공지 페이지**: `/notices` (새로 생성)
  - 공지 목록
  - 공지 상세 페이지
  - 댓글 표시

- **댓글 기능**: 각 갤러리/공지 하단
  - 댓글 입력 폼 (이름 선택적)
  - 댓글 목록
  - 실시간 업데이트 (선택적)

---

## 🚀 개발 단계

### Phase 1: Supabase 설정 (1일)
- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 스키마 생성
- [ ] Row Level Security (RLS) 설정
- [ ] Storage 버킷 생성 (이미지용)
- [ ] Next.js에 Supabase 클라이언트 설정

### Phase 2: 인증 시스템 (1-2일)
- [ ] Supabase Auth 설정
- [ ] Admin 로그인 페이지 구현
- [ ] 보호된 라우트 미들웨어 구현
- [ ] 로그아웃 기능

### Phase 3: 갤러리 기능 (2-3일)
- [ ] Admin 갤러리 관리 페이지
- [ ] 이미지 업로드 기능 (Supabase Storage)
- [ ] 갤러리 목록 표시
- [ ] 삭제/수정 기능
- [ ] 메인 페이지 갤러리 섹션 연동
- [ ] 댓글 기능 추가

### Phase 4: 공지 기능 (2-3일)
- [ ] Admin 공지 관리 페이지
- [ ] 공지 작성/수정 페이지
- [ ] 공지 목록 페이지 (공개)
- [ ] 공지 상세 페이지
- [ ] 댓글 기능 추가

### Phase 5: 최적화 및 테스트 (1일)
- [ ] 이미지 최적화
- [ ] 에러 처리
- [ ] 로딩 상태 처리
- [ ] 모바일 반응형 테스트
- [ ] 보안 검토

---

## 🔒 보안 고려사항

### Row Level Security (RLS)
- **갤러리/공지**: 모든 사용자 읽기 가능, Admin만 쓰기 가능
- **댓글**: 모든 사용자 읽기/쓰기 가능
- **Storage**: 공개 읽기, Admin만 쓰기

### 인증
- Admin만 로그인 가능
- 세션 관리
- 비밀번호 정책

### 입력 검증
- XSS 방지
- 이미지 파일 타입 검증
- 파일 크기 제한

---

## 📦 필요한 패키지

```json
{
  "@supabase/supabase-js": "^2.x",
  "@supabase/auth-helpers-nextjs": "^0.x",
  "@supabase/storage-js": "^2.x"
}
```

---

## 💰 비용 예상

### Supabase 무료 티어
- 500MB 데이터베이스
- 1GB 파일 스토리지
- 50,000 월간 활성 사용자
- 2GB 대역폭

**초기에는 무료 티어로 충분합니다!**

### 유료 전환 시기
- 트래픽 증가 시
- 이미지가 많아질 때
- 예상: $25/월 (Supabase Pro)

---

## 📝 다음 단계

1. **Supabase 프로젝트 생성**
   - https://supabase.com 접속
   - 새 프로젝트 생성
   - API 키 복사

2. **로컬 개발 환경 설정**
   - Supabase 클라이언트 설정
   - 환경 변수 설정

3. **인증 시스템 구현**
   - Admin 로그인 페이지
   - 보호된 라우트

4. **갤러리 기능 개발**
   - 업로드 기능
   - 메인 페이지 연동

5. **공지 기능 개발**
   - 공지 작성/목록
   - 댓글 기능

---

## 🎯 우선순위

1. **최우선**: Supabase 설정 + 인증 시스템
2. **높음**: 갤러리 기능 (메인 페이지 연동)
3. **중간**: 공지 기능
4. **낮음**: 댓글 기능 (기본 기능 완성 후)

---

**작성일**: 2024-12-09  
**프로젝트**: 무안 평산교회 웹사이트  
**다음 작업**: Supabase 프로젝트 생성

