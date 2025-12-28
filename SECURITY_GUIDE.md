# 보안 가이드 - Supabase API 키 노출에 대한 설명

## 🔒 현재 상황 분석

### ✅ 안전한 부분

1. **`.env.local` 파일은 Git에 커밋되지 않음**
   - `.gitignore`에 `.env.local`이 포함되어 있어 로컬 환경 변수는 Git에 올라가지 않습니다.

2. **`NEXT_PUBLIC_` 접두사가 붙은 키는 의도적으로 노출됨**
   - `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 클라이언트에서 사용되므로 노출됩니다.
   - **이것은 Supabase의 정상적인 설계입니다.**

3. **`service_role` 키는 사용하지 않음**
   - 현재 코드에서 `service_role` 키를 사용하지 않으므로 노출 위험이 없습니다.

### 🛡️ Supabase의 보안 모델

Supabase는 **Row Level Security (RLS)** 정책으로 보안을 보장합니다:

1. **`anon` 키의 역할**
   - 공개적으로 노출되어도 안전합니다.
   - RLS 정책에 따라 데이터 접근이 제한됩니다.
   - 예: 모든 사용자가 공지사항을 읽을 수 있지만, Admin만 작성할 수 있음

2. **실제 보안은 RLS 정책으로 보장**
   - 데이터베이스 레벨에서 접근 권한을 제어합니다.
   - 클라이언트에서 키를 알아도 RLS 정책을 우회할 수 없습니다.

3. **`service_role` 키는 절대 노출되면 안 됨**
   - RLS 정책을 우회할 수 있는 권한을 가집니다.
   - 현재 프로젝트에서는 사용하지 않으므로 안전합니다.

## 📋 배포 전 체크리스트

### ✅ 필수 확인 사항

1. **환경 변수 파일이 Git에 커밋되지 않았는지 확인**
   ```bash
   git status
   # .env.local이 나오면 안 됨
   ```

2. **Vercel 환경 변수 설정**
   - Vercel 대시보드 → Settings → Environment Variables
   - 다음 변수 추가:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Production, Preview, Development 모두에 추가**

3. **Supabase RLS 정책 확인**
   - Supabase 대시보드 → Authentication → Policies
   - 다음 정책이 설정되어 있는지 확인:
     - `gallery` 테이블: 모든 사용자 읽기 가능, Admin만 쓰기 가능
     - `notices` 테이블: 모든 사용자 읽기 가능 (published=true만), Admin만 쓰기 가능
     - `comments` 테이블: 모든 사용자 읽기/쓰기 가능
     - `storage` 버킷: 공개 읽기, Admin만 쓰기 가능

4. **테스트 페이지 제거 (선택사항)**
   - `/app/test-supabase/page.tsx`는 배포 전에 삭제하는 것을 권장합니다.

## 🚨 주의사항

### 절대 하지 말아야 할 것

1. ❌ `service_role` 키를 클라이언트 코드에 사용
2. ❌ `.env.local` 파일을 Git에 커밋
3. ❌ RLS 정책 없이 데이터베이스 테이블 사용
4. ❌ Admin 인증 없이 데이터 수정/삭제 허용

### 현재 프로젝트의 보안 상태

✅ **안전합니다!**

- `anon` 키만 사용하고 있으며, 이것은 의도적으로 노출되는 키입니다.
- RLS 정책으로 데이터 접근이 제한됩니다.
- Admin 인증은 Supabase Auth로 보호됩니다.
- `service_role` 키는 사용하지 않습니다.

## 📚 참고 자료

- [Supabase 보안 모범 사례](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js 환경 변수](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel 환경 변수 설정](https://vercel.com/docs/concepts/projects/environment-variables)

---

**결론**: 현재 설정으로 배포해도 안전합니다. `NEXT_PUBLIC_` 접두사가 붙은 키는 클라이언트에 노출되지만, 이것은 Supabase의 정상적인 설계이며 RLS 정책으로 보안이 보장됩니다.


