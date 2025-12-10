'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  images: string[] | null;
  created_at: string;
}

const ITEMS_PER_PAGE = 12;

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function loadGallery() {
      try {
        const supabase = createClient();

        // 전체 개수 가져오기
        const { count } = await supabase
          .from('gallery')
          .select('*', { count: 'exact', head: true });

        setTotalCount(count || 0);

        // 페이지네이션 계산
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;

        const { data, error: fetchError } = await supabase
          .from('gallery')
          .select('id, title, description, thumbnail_url, images, created_at')
          .order('created_at', { ascending: false })
          .range(from, to);

        if (fetchError) {
          console.error('갤러리 로드 오류:', fetchError);
          setError('갤러리를 불러오는 중 오류가 발생했습니다.');
          setGalleryItems([]);
        } else {
          setGalleryItems(data || []);
        }
        setLoading(false);
      } catch (err: any) {
        console.error('갤러리 로드 중 예외 발생:', err);
        setError(err.message || '갤러리를 불러올 수 없습니다.');
        setGalleryItems([]);
        setLoading(false);
      }
    }

    loadGallery();
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
            <Link href="/#gallery" className="text-text-light hover:text-text">
              ← 메인으로
            </Link>
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-text">
              갤러리
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
              교회 갤러리
            </h2>
            <p className="text-lg md:text-xl text-white/95 mt-2 drop-shadow-[0_3px_10px_rgba(0,0,0,0.7)]">
              함께하는 교회의 모습
            </p>
          </motion.div>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <main className="section-container py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {galleryItems.length === 0 ? (
            <div className="bg-white rounded-lg border border-text/10 p-12 text-center">
              <p className="text-text-light text-xl">아직 등록된 갤러리가 없습니다.</p>
            </div>
          ) : (
            <>
              {/* 갤러리 그리드 (썸네일) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
              >
                {galleryItems.map((item, index) => {
                  const thumbnailUrl = item.thumbnail_url || 
                    (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '');
                  const imageCount = Array.isArray(item.images) ? item.images.length : 0;

                  return (
                    <Link key={item.id} href={`/gallery/${item.id}`}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="bg-white rounded-lg shadow-sm overflow-hidden border border-text/10 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                      >
                        <div className="relative aspect-[4/3] w-full">
                          {thumbnailUrl ? (
                            <Image
                              src={thumbnailUrl}
                              alt={item.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-base text-text-light">
                              이미지 없음
                            </div>
                          )}
                          {imageCount > 1 && (
                            <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-medium">
                              {imageCount}장
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-text mb-1 line-clamp-1">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-text-light text-sm line-clamp-2 mb-2">
                              {item.description}
                            </p>
                          )}
                          <p className="text-text-light text-xs">
                            {new Date(item.created_at).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </motion.div>

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
            </>
          )}
        </div>
      </main>
    </div>
  );
}

