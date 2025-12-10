# Supabase 설정 가이드

## 📋 Step 1: Supabase 프로젝트 생성

### 1.1 Supabase 계정 생성
1. https://supabase.com 접속
2. "Start your project" 클릭
3. GitHub 계정으로 로그인 (또는 이메일)

### 1.2 새 프로젝트 생성
1. "New Project" 클릭
2. 프로젝트 정보 입력:
   - **Name**: `pyeongsan-church` (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (기억해두세요!)
   - **Region**: `Northeast Asia (Seoul)` 선택 (한국 서버)
3. "Create new project" 클릭
4. 프로젝트 생성 대기 (약 2분)

### 1.3 API 키 복사
1. 프로젝트 대시보드에서 좌측 메뉴의 **Settings** (톱니바퀴 아이콘) 클릭
2. **API** 메뉴 클릭
3. 다음 값들을 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 📋 Step 2: 환경 변수 설정

### 2.1 .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**예시**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2.2 Vercel 환경 변수 설정
1. Vercel 대시보드 접속
2. 프로젝트 선택 → **Settings** → **Environment Variables**
3. 다음 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Save** 클릭

---

## 📋 Step 3: 데이터베이스 스키마 생성

### 3.1 Supabase SQL Editor 접속
1. Supabase 대시보드에서 좌측 메뉴의 **SQL Editor** 클릭
2. "New query" 클릭

### 3.2 테이블 생성 SQL 실행

다음 SQL을 복사해서 실행하세요:

```sql
-- 1. users 테이블 (Admin)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. gallery 테이블 (갤러리)
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- 3. notices 테이블 (공지)
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- 4. comments 테이블 (댓글)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_type TEXT NOT NULL CHECK (post_type IN ('gallery', 'notice')),
  post_id UUID NOT NULL,
  author_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. 인덱스 생성 (성능 최적화)
CREATE INDEX idx_gallery_created_at ON gallery(created_at DESC);
CREATE INDEX idx_notices_published ON notices(published, created_at DESC);
CREATE INDEX idx_comments_post ON comments(post_type, post_id);
```

### 3.3 Row Level Security (RLS) 설정

보안을 위해 RLS를 설정합니다:

```sql
-- RLS 활성화
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 갤러리: 모든 사용자 읽기, 인증된 사용자만 쓰기
CREATE POLICY "Gallery is viewable by everyone" ON gallery
  FOR SELECT USING (true);

CREATE POLICY "Gallery is insertable by authenticated users" ON gallery
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Gallery is updatable by authenticated users" ON gallery
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Gallery is deletable by authenticated users" ON gallery
  FOR DELETE USING (auth.role() = 'authenticated');

-- 공지: 모든 사용자 읽기, 인증된 사용자만 쓰기
CREATE POLICY "Notices are viewable by everyone" ON notices
  FOR SELECT USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Notices are insertable by authenticated users" ON notices
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Notices are updatable by authenticated users" ON notices
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Notices are deletable by authenticated users" ON notices
  FOR DELETE USING (auth.role() = 'authenticated');

-- 댓글: 모든 사용자 읽기/쓰기
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Comments are insertable by everyone" ON comments
  FOR INSERT WITH CHECK (true);
```

---

## 📋 Step 4: Storage 버킷 생성

### 4.1 Storage 버킷 생성
1. Supabase 대시보드에서 **Storage** 메뉴 클릭
2. "Create a new bucket" 클릭
3. 버킷 정보 입력:
   - **Name**: `gallery-images`
   - **Public bucket**: ✅ 체크 (공개 읽기)
4. "Create bucket" 클릭

### 4.2 Storage 정책 설정
1. 생성된 버킷 클릭
2. **Policies** 탭 클릭
3. "New policy" 클릭 → "For full customization" 선택
4. 다음 정책 추가:

```sql
-- 공개 읽기
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery-images');

-- 인증된 사용자만 업로드
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gallery-images' AND
    auth.role() = 'authenticated'
  );

-- 인증된 사용자만 삭제
CREATE POLICY "Authenticated users can delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gallery-images' AND
    auth.role() = 'authenticated'
  );
```

---

## 📋 Step 5: 테스트

### 5.1 연결 테스트
로컬 개발 서버를 실행하고 연결이 잘 되는지 확인:

```bash
npm run dev
```

### 5.2 확인 사항
- [ ] Supabase 프로젝트 생성 완료
- [ ] 환경 변수 설정 완료
- [ ] 데이터베이스 테이블 생성 완료
- [ ] RLS 정책 설정 완료
- [ ] Storage 버킷 생성 완료
- [ ] 로컬에서 연결 테스트 완료

---

## 🔗 참고 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase + Next.js 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security 가이드](https://supabase.com/docs/guides/auth/row-level-security)

---

**작성일**: 2024-12-09  
**프로젝트**: 무안 평산교회 웹사이트

