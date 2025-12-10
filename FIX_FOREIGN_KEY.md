# Foreign Key 제약 조건 수정 가이드

## 문제
`notices` 테이블과 `gallery` 테이블의 `created_by` 필드가 `public.users` 테이블을 참조하고 있지만, 실제로는 Supabase Auth의 `auth.users` ID를 사용하고 있어 foreign key 제약 조건 오류가 발생합니다.

## 해결 방법

### 방법 1: created_by를 nullable로 변경 (권장)

Supabase SQL Editor에서 다음 SQL을 실행하세요:

```sql
-- notices 테이블의 created_by를 nullable로 변경
ALTER TABLE notices 
  DROP CONSTRAINT IF EXISTS notices_created_by_fkey;

ALTER TABLE notices 
  ALTER COLUMN created_by DROP NOT NULL;

-- gallery 테이블의 created_by도 nullable로 변경
ALTER TABLE gallery 
  DROP CONSTRAINT IF EXISTS gallery_created_by_fkey;

ALTER TABLE gallery 
  ALTER COLUMN created_by DROP NOT NULL;
```

### 방법 2: created_by 필드 제거 (더 간단)

만약 작성자 정보가 필요 없다면:

```sql
-- notices 테이블에서 created_by 제거
ALTER TABLE notices 
  DROP CONSTRAINT IF EXISTS notices_created_by_fkey;

ALTER TABLE notices 
  DROP COLUMN created_by;

-- gallery 테이블에서 created_by 제거
ALTER TABLE gallery 
  DROP CONSTRAINT IF EXISTS gallery_created_by_fkey;

ALTER TABLE gallery 
  DROP COLUMN created_by;
```

### 방법 3: auth.users와 연결 (고급)

만약 작성자 정보를 추적하고 싶다면, 별도의 프로필 테이블을 만들거나 `created_by`를 단순 UUID로 저장:

```sql
-- foreign key 제약 조건 제거하고 단순 UUID로 변경
ALTER TABLE notices 
  DROP CONSTRAINT IF EXISTS notices_created_by_fkey;

ALTER TABLE notices 
  ALTER COLUMN created_by TYPE UUID;

ALTER TABLE gallery 
  DROP CONSTRAINT IF EXISTS gallery_created_by_fkey;

ALTER TABLE gallery 
  ALTER COLUMN created_by TYPE UUID;
```

## 권장 사항

**방법 2 (created_by 제거)**를 권장합니다:
- 현재 Admin만 작성하므로 작성자 정보가 불필요
- 작성자 정보를 표시하는 UI도 없음
- 구조가 더 단순하고 명확함
- 나중에 필요하면 다시 추가 가능

## 실행 방법

1. Supabase 대시보드 접속
2. SQL Editor 열기
3. 위의 SQL 중 하나를 선택해서 실행
4. 완료!

