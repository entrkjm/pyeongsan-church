'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface Notice {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
}

const ITEMS_PER_PAGE = 10;

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function loadNotices() {
      try {
        const supabase = createClient();

        // 전체 개수 가져오기
        const { count } = await supabase
          .from('notices')
          .select('*', { count: 'exact', head: true })
          .eq('published', true);

        setTotalCount(count || 0);

        // 페이지네이션 계산
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { data, error: fetchError } = await supabase
          .from('notices')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .range(from, to);

        if (fetchError) {
          console.error('공지 로드 오류:', fetchError);
          setError('공지를 불러오는 중 오류가 발생했습니다.');
          setNotices([]);
        } else {
          setNotices(data || []);
        }
        setLoading(false);
      } catch (err: any) {
        console.error('공지 로드 중 예외 발생:', err);
        setError(err.message || '공지를 불러올 수 없습니다.');
        setNotices([]);
        setLoading(false);
      }
    }

    loadNotices();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="text-text">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base">
      {/* 헤더 */}
      <header className="bg-white border-b border-text/10 sticky top-0 z-40">
        <div className="section-container">
          <div className="relative flex items-center justify-between h-20">
            <Link href="/#notices" className="text-text-light hover:text-text">
              ← 메인으로
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
            alt="무안 평산교회"
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
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          {/* 게시판 형태 목록 */}
          {notices.length === 0 ? (
            <div className="bg-white rounded-lg border border-text/10 p-12 text-center">
              <p className="text-text-light text-xl">아직 등록된 공지가 없습니다.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-text/10 overflow-hidden"
            >
              {/* 테이블 헤더 (데스크탑) */}
              <div className="hidden md:grid md:grid-cols-[80px_1fr_150px] bg-base-light border-b border-text/10">
                <div className="px-4 py-3 text-sm font-semibold text-text">번호</div>
                <div className="px-4 py-3 text-sm font-semibold text-text">제목</div>
                <div className="px-4 py-3 text-sm font-semibold text-text text-center">작성일</div>
              </div>

              {/* 게시판 목록 */}
              <div className="divide-y divide-text/10">
                {notices.map((notice, index) => {
                  const noticeNumber = totalCount - (currentPage - 1) * ITEMS_PER_PAGE - index;
                  return (
                    <Link
                      key={notice.id}
                      href={`/notices/${notice.id}`}
                      className="block md:grid md:grid-cols-[80px_1fr_150px] hover:bg-base transition-colors duration-200"
                    >
                      {/* 번호 (데스크탑) */}
                      <div className="hidden md:flex items-center px-4 py-4 text-text-light text-sm">
                        {noticeNumber}
                      </div>
                      
                      {/* 제목 */}
                      <div className="px-4 py-4 md:py-4">
                        <div className="flex items-start gap-3">
                          {/* 번호 (모바일) */}
                          <span className="md:hidden text-text-light text-sm font-medium min-w-[30px]">
                            {noticeNumber}
                          </span>
                          <div className="flex-1">
                            <h3 className="text-base md:text-lg font-semibold text-[#1d1d1f] mb-1 line-clamp-2">
                              {notice.title}
                            </h3>
                            {/* 작성일 (모바일) */}
                            <p className="md:hidden text-text-light text-xs mt-1">
                              {new Date(notice.created_at).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 작성일 (데스크탑) */}
                      <div className="hidden md:flex items-center justify-center px-4 py-4 text-text-light text-sm">
                        {new Date(notice.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              {/* 이전 페이지 */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-md border border-text/10 text-text disabled:opacity-30 disabled:cursor-not-allowed hover:bg-base transition-colors"
              >
                이전
              </button>

              {/* 페이지 번호 */}
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // 현재 페이지 주변 2페이지만 표시
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-md border transition-colors ${
                          currentPage === page
                            ? 'border-text/20 font-semibold'
                            : 'border-text/10 hover:bg-base'
                        }`}
                        style={
                          currentPage === page
                            ? { backgroundColor: '#E8E0D6', color: '#5D4E37' }
                            : { color: '#1d1d1f' }
                        }
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return (
                      <span key={page} className="px-2 text-text-light">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              {/* 다음 페이지 */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-md border border-text/10 text-text disabled:opacity-30 disabled:cursor-not-allowed hover:bg-base transition-colors"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

