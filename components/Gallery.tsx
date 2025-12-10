'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string; // 하위 호환성
  thumbnail_url: string | null;
  images: string[] | null; // 이미지 배열
  created_at: string;
}

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    async function loadGallery() {
      try {
        const supabase = createClient();

        // 타임아웃 설정 (3초)
        timeoutId = setTimeout(() => {
          if (isMounted) {
            setError('데이터 로드 시간이 초과되었습니다.');
            setLoading(false);
            setGalleryItems([]);
          }
        }, 3000);

        const { data, error: fetchError } = await supabase
          .from('gallery')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6); // 최근 6개만

        clearTimeout(timeoutId);

        if (!isMounted) return;

        if (fetchError) {
          console.error('갤러리 로드 오류:', fetchError);
          setError('갤러리를 불러오는 중 오류가 발생했습니다.');
          setGalleryItems([]);
          setLoading(false);
        } else {
          setGalleryItems(data || []);
          setLoading(false);
        }
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (!isMounted) return;
        
        console.error('갤러리 로드 중 예외 발생:', err);
        setError(err.message || '갤러리를 불러올 수 없습니다.');
        setGalleryItems([]);
        setLoading(false);
      }
    }

    loadGallery();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <section
      id="gallery"
      className="bg-white py-16 md:py-20 border-t border-text/10"
    >
      <div className="section-container">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-text mb-6">
            갤러리
          </h2>
          <p className="text-2xl md:text-3xl text-text-light">
            함께하는 교회의 모습
          </p>
        </motion.div>

        {/* 이미지 갤러리 그리드 */}
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-text-light">로딩 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <p className="text-text-light text-sm">갤러리 데이터를 불러올 수 없습니다.</p>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-light">아직 업로드된 사진이 없습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {galleryItems.map((item, index) => {
                // 대표 이미지 URL (thumbnail_url 우선, 없으면 image_url, 없으면 images 배열의 첫 번째)
                const thumbnailUrl = item.thumbnail_url || item.image_url || 
                  (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '');
                
                return (
                  <Link key={item.id} href={`/gallery/${item.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ 
                        scale: 1.02,
                        y: -4,
                        transition: { duration: 0.2, ease: "easeOut" }
                      }}
                      className="relative overflow-hidden border-b border-text/10 cursor-pointer group"
                    >
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={thumbnailUrl}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="text-center text-white px-4">
                          <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                          {item.description && (
                            <p className="text-sm text-white/90 line-clamp-2">{item.description}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* 전체 갤러리 보기 버튼 */}
          {galleryItems.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                href="/gallery"
                className="inline-block px-6 py-3 rounded-md transition-all duration-200 font-medium"
                style={{ color: '#5D4E37' }}
              >
                전체 갤러리 보기 →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

