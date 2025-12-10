'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Comments from '@/components/Comments';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  images: string[] | null;
  thumbnail_url: string | null;
  created_at: string;
}

export default function GalleryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const galleryId = params.id as string;

  const [galleryItem, setGalleryItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('gallery')
        .select('*')
        .eq('id', galleryId)
        .single();

      if (fetchError || !data) {
        console.error('갤러리 로드 오류:', fetchError);
        setError('갤러리를 불러오는 데 실패했습니다.');
        setGalleryItem(null);
      } else {
        setGalleryItem(data);
      }
      setLoading(false);
    }

    if (galleryId) {
      fetchGallery();
    }
  }, [galleryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center pt-28 md:pt-32">
        <p className="text-text">갤러리 로딩 중...</p>
      </div>
    );
  }

  if (error || !galleryItem) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center p-4 pt-28 md:pt-32">
        <div className="text-center bg-white rounded-lg shadow-sm p-8 border border-text/5">
          <p className="text-red-500 mb-4">{error || '갤러리를 찾을 수 없습니다.'}</p>
          <Link
            href="/#gallery"
            className="inline-block px-6 py-3.5 rounded-md transition-all duration-200 font-bold shadow-sm hover:shadow-md"
            style={{ backgroundColor: '#E8E0D6', color: '#5D4E37' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D4C4B0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#E8E0D6';
            }}
          >
            ← 갤러리로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(galleryItem.images) && galleryItem.images.length > 0
    ? galleryItem.images
    : galleryItem.thumbnail_url
    ? [galleryItem.thumbnail_url]
    : [];

  return (
    <div className="min-h-screen bg-base">
      {/* 헤더 */}
      <header className="bg-white border-b border-text/10 sticky top-0 z-40">
        <div className="section-container">
          <div className="relative flex items-center justify-between h-20">
            <Link 
              href="/gallery" 
              className="text-text-light hover:text-text"
              style={{ color: '#1d1d1f' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#1d1d1f';
              }}
            >
              ← 갤러리 목록으로
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
      
      <div className="section-container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >

          {/* 제목 및 설명 */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">
              {galleryItem.title}
            </h1>
            {galleryItem.description && (
              <p className="text-lg md:text-xl text-text-light mb-3">
                {galleryItem.description}
              </p>
            )}
            <p className="text-text-light text-sm">
              {new Date(galleryItem.created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* 이미지 그리드 - 더 크게 */}
          {images.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-text/5">
              <p className="text-text-light">이미지가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
              {images.map((imageUrl, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border border-text/10 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <Image
                    src={imageUrl}
                    alt={`${galleryItem.title} - 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* 댓글 섹션 - 더 작게 */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4 md:p-6 border border-text/5">
            <Comments postType="gallery" postId={galleryId} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

