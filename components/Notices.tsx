'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

interface Notice {
  id: string;
  title: string;
  image_url: string | null;
  created_at: string;
}

export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    async function loadNotices() {
      try {
        const supabase = createClient();

        // 타임아웃 설정 (3초)
        timeoutId = setTimeout(() => {
          if (isMounted) {
            setError('데이터 로드 시간이 초과되었습니다.');
            setLoading(false);
            setNotices([]);
          }
        }, 3000);

        const { data, error: fetchError } = await supabase
          .from('notices')
            .select('id, title, image_url, created_at')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(5); // 최신 5개만 표시

        clearTimeout(timeoutId);

        if (!isMounted) return;

        if (fetchError) {
          console.error('공지 로드 오류:', fetchError);
          setError('공지를 불러오는 중 오류가 발생했습니다.');
          setNotices([]);
          setLoading(false);
        } else {
          setNotices(data || []);
          setLoading(false);
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (!isMounted) return;
        
        console.error('공지 로드 중 예외 발생:', err);
        setError(err.message || '공지를 불러올 수 없습니다.');
        setNotices([]);
        setLoading(false);
      }
    }

    loadNotices();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // 자동 슬라이드 (선택사항 - 필요시 활성화)
  // useEffect(() => {
  //   if (notices.length <= 1) return;
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prev) => (prev + 1) % notices.length);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, [notices.length]);

  const handlePrevious = () => {
    if (notices.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + notices.length) % notices.length);
  };

  const handleNext = () => {
    if (notices.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % notices.length);
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }
  };

  if (loading) {
    return (
      <section id="notices" className="bg-white py-16 md:py-20 border-t border-text/10 text-center">
        <p className="text-text-light">공지 로딩 중...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="notices" className="bg-white py-16 md:py-20 border-t border-text/10 text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  if (notices.length === 0) {
    return (
      <section id="notices" className="bg-white py-16 md:py-20 border-t border-text/10">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-bold text-text mb-6">
              교회 공지
            </h2>
            <p className="text-2xl md:text-3xl text-text-light">
              함께 나누는 소식
            </p>
          </motion.div>
          <p className="text-center text-text-light text-xl py-12">아직 등록된 공지가 없습니다.</p>
        </div>
      </section>
    );
  }

  const currentNotice = notices[currentIndex];

  return (
    <section
      id="notices"
      className="bg-white py-12 md:py-16 border-t border-text/10"
    >
      <div className="section-container">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-text mb-6">
            교회 공지
          </h2>
          <p className="text-2xl md:text-3xl text-text-light">
            함께 나누는 소식
          </p>
        </motion.div>

        {/* 카드 슬라이더 */}
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div
            ref={containerRef}
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* 좌우 버튼 */}
            {notices.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 md:-translate-x-24 z-10 bg-white/90 hover:bg-white rounded-full p-2 md:p-3 shadow-lg border border-text/10 transition-all duration-200 hover:scale-110"
                  aria-label="이전 공지"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 md:h-6 md:w-6 text-text"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 md:translate-x-24 z-10 bg-white/90 hover:bg-white rounded-full p-2 md:p-3 shadow-lg border border-text/10 transition-all duration-200 hover:scale-110"
                  aria-label="다음 공지"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 md:h-6 md:w-6 text-text"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* 카드 */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href={`/notices/${currentNotice.id}`}
                  className="block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-5 md:p-6">
                    {/* 텍스트 영역 (메인) */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl font-bold text-text mb-2 md:mb-3 line-clamp-2">
                        {currentNotice.title}
                      </h3>
                      <p 
                        className="text-sm md:text-base font-medium"
                        style={{ color: '#4a4a4a' }}
                      >
                        {new Date(currentNotice.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* 이미지 영역 (첨가물) */}
                    {currentNotice.image_url && (
                      <div className="relative w-full md:w-32 md:flex-shrink-0 h-32 md:h-32 rounded-lg overflow-hidden border border-text/5">
                        <Image
                          src={currentNotice.image_url}
                          alt={currentNotice.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 128px"
                        />
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* 인디케이터 (점) */}
            {notices.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {notices.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex
                        ? 'bg-accent-primary-dark w-8'
                        : 'bg-text/20 hover:bg-text/40'
                    }`}
                    aria-label={`공지 ${index + 1}로 이동`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 전체 공지 보기 버튼 */}
          <div className="mt-6 text-center">
            <Link
              href="/notices"
              className="inline-block px-6 py-3 rounded-md transition-all duration-200 font-medium"
              style={{ color: '#5D4E37' }}
            >
              전체 공지 보기 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

