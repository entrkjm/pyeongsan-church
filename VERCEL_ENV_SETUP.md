# Vercel 환경 변수 설정 가이드

## 문제 증상
- 공지와 갤러리를 불러오는 중 오류 발생
- "공지를 불러오는 중 오류가 발생했습니다"
- "갤러리를 불러오는 중 오류가 발생했습니다"

## 원인
Vercel에 Supabase 환경 변수가 설정되지 않았거나, 환경 변수 설정 후 재배포가 되지 않았을 수 있습니다.

## 해결 방법

### 1. Vercel 대시보드에서 환경 변수 설정

1. **Vercel 대시보드 접속**
   - https://vercel.com 접속
   - 프로젝트 선택

2. **환경 변수 설정 페이지로 이동**
   - 프로젝트 선택 → **Settings** (설정) → **Environment Variables** (환경 변수)

3. **필수 환경 변수 추가**
   다음 두 개의 환경 변수를 추가하세요:

   | 변수 이름 | 값 |
   |---------|-----|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL (예: `https://xxxxx.supabase.co`) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon public key |

   **추가 방법:**
   - "Add New" 버튼 클릭
   - Key에 `NEXT_PUBLIC_SUPABASE_URL` 입력
   - Value에 Supabase URL 입력
   - Environment는 **Production, Preview, Development 모두 선택**
   - "Save" 클릭
   - 동일한 방법으로 `NEXT_PUBLIC_SUPABASE_ANON_KEY`도 추가

4. **Supabase 정보 확인 방법**
   - Supabase 대시보드 접속
   - 프로젝트 선택
   - 좌측 메뉴 **Settings** (톱니바퀴 아이콘) → **API**
   - **Project URL**과 **anon public** 키 복사

### 2. 재배포 필수

환경 변수를 추가한 후 **반드시 재배포**해야 합니다:

**방법 1: 자동 재배포 (권장)**
- Git에 변경사항을 커밋하고 푸시
- Vercel이 자동으로 재배포합니다

**방법 2: 수동 재배포**
- Vercel 대시보드 → **Deployments** 탭
- 최신 배포의 "..." 메뉴 → **Redeploy**
- 또는 빈 커밋을 만들어 푸시:
  ```bash
  git commit --allow-empty -m "Trigger redeploy for env vars"
  git push
  ```

### 3. 환경 변수 확인

재배포 후 다음을 확인하세요:

1. **브라우저 개발자 도구 콘솔 확인**
   - F12 또는 Cmd+Option+I (Mac) / Ctrl+Shift+I (Windows)
   - Console 탭에서 에러 메시지 확인

2. **Vercel 빌드 로그 확인**
   - Vercel 대시보드 → **Deployments** → 최신 배포 클릭
   - 빌드 로그에서 환경 변수 관련 에러 확인

3. **환경 변수 값 확인 (로컬)**
   ```bash
   # .env.local 파일 확인
   cat .env.local
   ```

## 주의사항

⚠️ **중요**: `NEXT_PUBLIC_` 접두사가 있는 환경 변수는 **빌드 타임**에 번들에 포함됩니다.
- 환경 변수를 추가한 후 **반드시 재배포**해야 합니다
- 기존 배포는 환경 변수 변경 사항을 반영하지 않습니다

## 문제 해결 체크리스트

- [ ] Vercel에 `NEXT_PUBLIC_SUPABASE_URL` 환경 변수 설정됨
- [ ] Vercel에 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 환경 변수 설정됨
- [ ] 환경 변수가 Production, Preview, Development 모두에 적용됨
- [ ] 환경 변수 추가 후 재배포 완료
- [ ] 브라우저 콘솔에서 에러 메시지 확인
- [ ] Supabase 프로젝트가 활성화되어 있고 접근 가능한지 확인

## 추가 도움말

문제가 계속되면:
1. Vercel 빌드 로그 확인
2. 브라우저 네트워크 탭에서 Supabase API 요청 확인
3. Supabase 대시보드에서 프로젝트 상태 확인
