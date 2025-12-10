# Vercel 환경 변수 설정 가이드

## 🔑 왜 환경 변수가 필요한가?

GitHub에는 민감한 정보(API 키, 비밀번호 등)를 올리지 않습니다. 대신:
- **로컬 개발**: `.env.local` 파일에 저장 (Git에 올라가지 않음)
- **Vercel 배포**: Vercel 대시보드에서 환경 변수로 설정

이렇게 하면 코드는 공개되지만, 실제 API 키는 안전하게 보관됩니다.

## 📋 Vercel 환경 변수 설정 방법

### 1. Vercel 대시보드 접속
1. https://vercel.com 접속
2. 프로젝트 선택 (`pyeongsan-church`)

### 2. 환경 변수 추가
1. 프로젝트 페이지에서 **Settings** 탭 클릭
2. 좌측 메뉴에서 **Environment Variables** 클릭
3. 다음 변수들을 추가:

#### 필수 환경 변수

**변수 1:**
- **Key**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Supabase 프로젝트 URL (예: `https://xxxxx.supabase.co`)
- **Environment**: Production, Preview, Development 모두 선택 ✅

**변수 2:**
- **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Supabase anon public key (예: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
- **Environment**: Production, Preview, Development 모두 선택 ✅

### 3. Supabase 키 찾는 방법
1. Supabase 대시보드 접속: https://supabase.com
2. 프로젝트 선택
3. 좌측 메뉴 → **Settings** (톱니바퀴 아이콘)
4. **API** 메뉴 클릭
5. 다음 값 복사:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`에 입력
   - **anon public** 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 입력

### 4. 저장 및 재배포
1. 각 변수 입력 후 **Save** 클릭
2. **Deployments** 탭으로 이동
3. 최신 배포 옆 **⋯** 메뉴 → **Redeploy** 클릭
   - 또는 새로운 커밋을 푸시하면 자동으로 재배포됩니다

## ✅ 확인 방법

환경 변수가 제대로 설정되었는지 확인:

1. Vercel 대시보드 → **Deployments** → 최신 배포 클릭
2. **Build Logs** 확인
3. 오류가 없으면 성공!

## 🚨 문제 해결

### 오류: `500: INTERNAL_SERVER_ERROR - MIDDLEWARE_INVOCATION_FAILED`
- **원인**: 환경 변수가 설정되지 않았거나 잘못된 값
- **해결**: 
  1. Vercel 대시보드에서 환경 변수 확인
  2. Production, Preview, Development 모두에 설정되어 있는지 확인
  3. 값이 정확한지 확인 (공백, 따옴표 없이)
  4. 재배포

### 오류: `NEXT_PUBLIC_SUPABASE_URL is not defined`
- **원인**: 환경 변수 이름이 잘못되었거나 설정되지 않음
- **해결**: 
  1. 변수 이름이 정확히 `NEXT_PUBLIC_SUPABASE_URL`인지 확인 (대소문자 구분)
  2. 모든 환경(Production, Preview, Development)에 설정되어 있는지 확인

## 📝 참고사항

- `NEXT_PUBLIC_` 접두사가 붙은 변수는 클라이언트에서도 접근 가능합니다
- Supabase의 `anon` 키는 공개되어도 안전합니다 (RLS 정책으로 보호됨)
- 환경 변수를 변경한 후에는 **반드시 재배포**해야 적용됩니다

