-- 갤러리 구조 변경: 여러 이미지 묶음 지원
-- Supabase SQL Editor에서 실행하세요

-- 1. 기존 gallery 테이블에 새 필드 추가
ALTER TABLE gallery 
  ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- 2. 기존 데이터 마이그레이션 (image_url을 images 배열의 첫 번째 요소로, thumbnail_url로도 설정)
UPDATE gallery 
SET 
  images = jsonb_build_array(image_url),
  thumbnail_url = image_url
WHERE images = '[]'::jsonb OR images IS NULL;

-- 3. thumbnail_url을 NOT NULL로 변경 (기존 데이터 마이그레이션 후)
-- ALTER TABLE gallery ALTER COLUMN thumbnail_url SET NOT NULL;

-- 4. 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_gallery_thumbnail ON gallery(thumbnail_url);
CREATE INDEX IF NOT EXISTS idx_gallery_images ON gallery USING GIN(images);

