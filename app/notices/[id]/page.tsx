'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import Image from 'next/image';
import Link from 'next/link';
import Comments from '@/components/Comments';

interface Notice {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function NoticeDetail() {
  const params = useParams();
  const router = useRouter();
  const noticeId = params.id as string;

  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotice() {
      try {
        const supabase = createClient();

        const { data, error: fetchError } = await supabase
          .from('notices')
          .select('*')
          .eq('id', noticeId)
          .eq('published', true)
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            setError('공지를 찾을 수 없습니다.');
          } else {
            setError('공지를 불러오는 중 오류가 발생했습니다.');
          }
          setLoading(false);
          return;
        }

        if (data) {
          setNotice(data);
        } else {
          setError('공지를 찾을 수 없습니다.');
        }
        setLoading(false);
      } catch (err: any) {
        console.error('공지 로드 중 예외 발생:', err);
        setError('공지를 불러올 수 없습니다.');
        setLoading(false);
      }
    }

    if (noticeId) {
      loadNotice();
    }
  }, [noticeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="text-text">로딩 중...</p>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-light text-xl mb-4">{error || '공지를 찾을 수 없습니다.'}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-md transition-all duration-200 font-medium"
            style={{ backgroundColor: '#E8E0D6', color: '#5D4E37' }}
          >
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base">
      {/* 헤더 */}
      <header className="bg-white border-b border-text/10 sticky top-0 z-40">
        <div className="section-container">
          <div className="relative flex items-center justify-between h-20">
            <Link href="/notices" className="text-text-light hover:text-text">
              ← 공지사항
            </Link>
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-text">
              교회 공지
            </h1>
            <div className="w-[100px]"></div>
          </div>
        </div>
      </header>

      {/* 이미지 섹션 */}
      <section className="relative w-full h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/notices-hero.jpg"
            alt="평산성결교회"
            fill
            className="object-cover object-bottom"
            priority
            quality={90}
          />
          {/* 어두운 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50" />
        </div>
        {/* 텍스트 오버레이 */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              교회 공지사항
            </h2>
            <p className="text-lg md:text-xl text-white/95 mt-2 drop-shadow-[0_3px_10px_rgba(0,0,0,0.7)]">
              함께 나누는 소식
            </p>
          </motion.div>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <main className="section-container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <article className="bg-white rounded-lg shadow-xl p-8 md:p-10 border border-text/5">
            {/* 제목과 날짜 */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
                {notice.title}
              </h1>
              <p className="text-text-light">
                {new Date(notice.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </header>

            {/* 이미지 (있으면) */}
            {notice.image_url && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
                <Image
                  src={notice.image_url}
                  alt={notice.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* 내용 */}
            <div
              className="prose prose-lg max-w-none text-text"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(notice.content, {
                  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a'],
                  ALLOWED_ATTR: ['href', 'target', 'rel'],
                })
              }}
            />

            {/* 하단 링크 */}
            <div className="mt-12 pt-8 border-t border-text/10">
              <Link
                href="/notices"
                className="inline-block px-6 py-3 rounded-md transition-all duration-200 font-medium"
                style={{ backgroundColor: '#E8E0D6', color: '#5D4E37' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D4C4B0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#E8E0D6';
                }}
              >
                ← 공지사항 목록으로
              </Link>
            </div>
          </article>

          {/* 댓글 섹션 */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-8 md:p-10 border border-text/5">
            <Comments postType="notice" postId={noticeId} />
          </div>
        </motion.div>
      </main>
    </div>
  );
}

