-- 댓글 기능을 위한 테이블 생성
-- Supabase SQL Editor에서 실행하세요

-- 1. comments 테이블 생성
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_type TEXT NOT NULL CHECK (post_type IN ('gallery', 'notice')),
  post_id UUID NOT NULL,
  author_name TEXT, -- 익명 사용자 이름 (선택적)
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_type, post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- 3. Row Level Security (RLS) 설정
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 댓글 읽기 가능
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

-- 모든 사용자가 댓글 작성 가능 (익명 댓글)
CREATE POLICY "Comments are insertable by everyone" ON comments
  FOR INSERT WITH CHECK (true);

-- Admin만 댓글 삭제 가능
CREATE POLICY "Comments are deletable by authenticated users" ON comments
  FOR DELETE USING (auth.role() = 'authenticated');

