# 토큰 및 비밀 정보 저장 가이드

## ⚠️ 중요: 토큰은 Git에 커밋하면 안 됩니다!

GitHub Personal Access Token이 Git 히스토리에 포함되어 있었습니다. **보안을 위해 즉시 새 토큰을 생성**하세요.

## 🔐 GitHub Personal Access Token 재생성

### 1. 기존 토큰 무효화 (권장)
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 노출된 토큰을 찾아서 **Revoke** 클릭

### 2. 새 토큰 생성
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)" 클릭
3. 토큰 이름: `pyeongsan-church-deployment` (또는 원하는 이름)
4. 권한 선택:
   - `repo` (전체) - 저장소 접근
   - 또는 필요한 권한만 선택
5. "Generate token" 클릭
6. **토큰을 복사** (한 번만 보여줍니다!)

## 💾 토큰 안전하게 저장하기

### 방법 1: 로컬 파일에 저장 (Git에 커밋하지 않음)
프로젝트 루트에 `tokens.local.txt` 파일 생성 (`.gitignore`에 포함됨):
```
# 이 파일은 Git에 커밋되지 않습니다
GITHUB_TOKEN=ghp_your_new_token_here
```

### 방법 2: 시스템 환경 변수로 저장
```bash
# macOS/Linux
export GITHUB_TOKEN=ghp_your_new_token_here

# 영구적으로 저장하려면 ~/.zshrc 또는 ~/.bashrc에 추가
echo 'export GITHUB_TOKEN=ghp_your_new_token_here' >> ~/.zshrc
```

### 방법 3: 비밀 관리 도구 사용
- **1Password**, **LastPass**, **Bitwarden** 등의 비밀 관리 도구 사용
- 또는 macOS Keychain 사용

### 방법 4: Vercel 환경 변수 (배포용)
Vercel 대시보드에서 환경 변수로 저장:
- Settings → Environment Variables
- `GITHUB_TOKEN` 추가 (필요한 경우)

## 📝 현재 프로젝트에서 필요한 토큰

### Supabase 키 (이미 설정됨)
- `NEXT_PUBLIC_SUPABASE_URL` - Vercel 환경 변수에 설정
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Vercel 환경 변수에 설정
- `.env.local` 파일에 로컬 개발용으로 저장 (Git에 커밋 안 됨)

### GitHub Token (필요한 경우)
- CI/CD 자동화가 필요한 경우에만 사용
- 현재 프로젝트에서는 Vercel이 자동으로 GitHub과 연동되므로 별도 토큰 불필요

## ✅ 확인 사항

1. ✅ `.gitignore`에 `*_token.txt`, `*token*.txt` 추가됨
2. ✅ 기존 토큰 무효화 (GitHub에서)
3. ✅ 새 토큰 생성 (필요한 경우)
4. ✅ 토큰을 안전한 곳에 저장 (Git에 커밋하지 않음)

## 🚨 토큰이 노출된 경우

1. **즉시 토큰 무효화** (GitHub에서)
2. **새 토큰 생성**
3. **Git 히스토리에서 제거** (이미 완료됨)
4. **토큰이 사용된 모든 서비스에서 업데이트**

---

**참고**: 현재 프로젝트는 Vercel을 통해 배포되므로, GitHub Personal Access Token이 반드시 필요하지 않습니다. Vercel이 GitHub 저장소에 직접 접근할 수 있습니다.

