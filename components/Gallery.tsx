'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  created_at: string;
}

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('갤러리 로드 오류:', error);
        // 에러 발생 시 빈 배열로 설정
        setGalleryItems([]);
      } else {
        setGalleryItems(data || []);
      }
      setLoading(false);
    }

    loadGallery();
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
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-light">아직 업로드된 사진이 없습니다</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {galleryItems.map((item, index) => (
                <motion.div
                  key={item.id}
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
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

