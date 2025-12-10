# 도메인 설정 가이드

## 📋 도메인이란?

도메인은 웹사이트의 주소입니다.
- **Vercel 기본 URL**: `pyeongsan-church.vercel.app` (무료 제공)
- **커스텀 도메인**: `pyeongsan-church.kr` 또는 `pyeongsan-church.com` (구매 필요)

---

## 🎯 도메인을 사용하는 이유

1. **전문성**: `pyeongsan-church.kr`이 `pyeongsan-church.vercel.app`보다 더 전문적으로 보임
2. **기억하기 쉬움**: 짧고 명확한 주소
3. **SEO**: 검색 엔진에서 더 나은 평가
4. **브랜딩**: 교회 이름을 주소로 사용

---

## 💰 도메인 구매 방법

### 1. 도메인 구매 사이트 선택

#### 국내 사이트 (한국어 지원, 결제 편리)
- **가비아**: https://www.gabia.com
  - 가격: .kr 약 15,000원/년, .com 약 20,000원/년
  - 한국어 지원, 신용카드/계좌이체 가능
- **후이즈**: https://whois.co.kr
  - 가격: 비슷한 수준
  - 간단한 인터페이스
- **카페24**: https://www.cafe24.com
  - 호스팅과 함께 구매 가능

#### 해외 사이트 (저렴한 경우 많음)
- **Namecheap**: https://www.namecheap.com
  - 가격: .com 약 $10-15/년
  - 영어 사이트
- **Google Domains**: https://domains.google
  - 간단한 인터페이스
  - Google 계정으로 관리

### 2. 도메인 이름 선택

**추천 도메인 예시**:
- `pyeongsan-church.kr` (한국 도메인, 교회에 적합)
- `pyeongsan-church.com` (국제 도메인)
- `pyeongsan.kr` (짧고 간단)
- `평산교회.kr` (한글 도메인, 비추천 - 입력 불편)

**고려사항**:
- 짧고 기억하기 쉬운 것
- 하이픈(-) 최소화
- .kr은 한국 사이트에 적합
- .com은 국제적으로 인지도 높음

### 3. 도메인 구매

1. 선택한 사이트에서 원하는 도메인 검색
2. 사용 가능 여부 확인
3. 장바구니에 추가
4. 결제 정보 입력
5. 구매 완료

---

## 🔧 Vercel에 도메인 연결하기

### Step 1: Vercel 프로젝트에 도메인 추가

1. Vercel 대시보드 접속: https://vercel.com
2. 프로젝트 선택 (`pyeongsan-church`)
3. **Settings** 탭 클릭
4. **Domains** 메뉴 클릭
5. 도메인 입력 (예: `pyeongsan-church.kr`)
6. **Add** 클릭

### Step 2: DNS 설정 안내 확인

Vercel에서 DNS 설정 방법을 안내합니다. 두 가지 방법이 있습니다:

#### 방법 A: CNAME 레코드 (서브도메인, 추천)
- **Type**: CNAME
- **Name**: `www` 또는 `@`
- **Value**: `cname.vercel-dns.com` (Vercel에서 제공하는 값)

#### 방법 B: A 레코드 (루트 도메인)
- **Type**: A
- **Name**: `@`
- **Value**: Vercel에서 제공하는 IP 주소 (예: `76.76.21.21`)

### Step 3: 도메인 제공업체에서 DNS 설정

구매한 도메인 사이트의 DNS 관리 페이지에서 설정:

#### 가비아 예시:
1. 가비아 로그인
2. "도메인 관리" → "DNS 관리"
3. 레코드 추가:
   - **호스트**: `www` 또는 `@`
   - **타입**: CNAME
   - **값**: `cname.vercel-dns.com`
   - **TTL**: 3600 (기본값)
4. 저장

#### Namecheap 예시:
1. Namecheap 로그인
2. Domain List → Manage
3. Advanced DNS 탭
4. Add New Record:
   - **Type**: CNAME Record
   - **Host**: `www`
   - **Value**: `cname.vercel-dns.com`
5. Save

### Step 4: DNS 전파 대기

- DNS 변경 사항이 전 세계에 전파되는 데 **24-48시간** 소요될 수 있습니다
- 보통 **몇 분에서 몇 시간** 내에 완료됩니다
- Vercel 대시보드에서 연결 상태 확인 가능

### Step 5: SSL 인증서 자동 발급

- Vercel이 자동으로 SSL 인증서를 발급합니다
- HTTPS가 자동으로 활성화됩니다
- 별도 설정 불필요

---

## 📝 도메인 설정 체크리스트

### 구매 전
- [ ] 도메인 이름 결정
- [ ] 도메인 구매 사이트 선택
- [ ] 도메인 사용 가능 여부 확인

### 구매 후
- [ ] Vercel 프로젝트에 도메인 추가
- [ ] DNS 레코드 설정 (CNAME 또는 A 레코드)
- [ ] DNS 전파 대기 (24-48시간)
- [ ] Vercel에서 연결 상태 확인
- [ ] 브라우저에서 도메인 접속 테스트

---

## 💡 자주 묻는 질문

### Q1: 도메인을 꼭 사야 하나요?
**A**: 아니요. Vercel 기본 URL(`pyeongsan-church.vercel.app`)로도 충분히 사용 가능합니다. 다만 전문성과 기억하기 쉬운 주소를 원한다면 구매하는 것이 좋습니다.

### Q2: .kr과 .com 중 어느 것이 좋나요?
**A**: 
- **.kr**: 한국 사이트에 적합, 가격 저렴, 한국 사용자에게 친숙
- **.com**: 국제적으로 인지도 높음, 해외 사용자에게 친숙
- 교회 웹사이트는 주로 한국 사용자이므로 **.kr 추천**

### Q3: www를 붙여야 하나요?
**A**: 선택사항입니다. Vercel은 자동으로 `www`와 루트 도메인(`@`) 모두 연결해줍니다.
- `pyeongsan-church.kr` ✅
- `www.pyeongsan-church.kr` ✅
- 둘 다 같은 사이트로 연결됩니다

### Q4: 도메인 비용은 얼마인가요?
**A**: 
- **.kr**: 약 15,000-20,000원/년
- **.com**: 약 10,000-20,000원/년 (해외 사이트에서 구매 시 더 저렴할 수 있음)

### Q5: DNS 설정이 복잡한가요?
**A**: 아니요. 도메인 구매 사이트의 DNS 관리 페이지에서 레코드만 추가하면 됩니다. Vercel이 정확한 값을 안내해줍니다.

### Q6: 도메인 연결 후 Vercel 기본 URL은 어떻게 되나요?
**A**: Vercel 기본 URL(`pyeongsan-church.vercel.app`)도 계속 작동합니다. 두 주소 모두 같은 사이트로 연결됩니다.

---

## 🚀 빠른 시작 (도메인 구매 후)

1. **도메인 구매** (가비아 또는 후이즈 추천)
2. **Vercel에 도메인 추가** (Settings → Domains)
3. **DNS 설정** (CNAME 레코드 추가)
4. **대기** (DNS 전파, 보통 몇 시간)
5. **완료!** 🎉

---

## 📚 참고 자료

- **Vercel 도메인 문서**: https://vercel.com/docs/concepts/projects/domains
- **가비아 도메인**: https://www.gabia.com
- **후이즈 도메인**: https://whois.co.kr

---

**작성일**: 2024-12-09  
**프로젝트**: 무안 평산교회 웹사이트

