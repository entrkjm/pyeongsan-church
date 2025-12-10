'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  created_at: string;
}

export default function AdminGallery() {
  const router = useRouter();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function checkAuthAndLoadGallery() {
      const supabase = createClient();
      
      // 인증 확인
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
        return;
      }
      setUser(user);

      // 갤러리 데이터 로드
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('갤러리 로드 오류:', error);
      } else {
        setGalleryItems(data || []);
      }
      setLoading(false);
    }

    checkAuthAndLoadGallery();
  }, [router]);

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    const supabase = createClient();
    
    try {
      // Storage에서 이미지 삭제
      const fileName = imageUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('gallery-images').remove([fileName]);
      }

      // 데이터베이스에서 삭제
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 목록에서 제거
      setGalleryItems(galleryItems.filter(item => item.id !== id));
    } catch (error: any) {
      alert('삭제 실패: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="text-text">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base">
      {/* 헤더 */}
      <header className="bg-white border-b border-text/10">
        <div className="section-container">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-text-light hover:text-text">
                ← 대시보드
              </Link>
              <h1 className="text-2xl font-bold text-text">갤러리 관리</h1>
            </div>
            <Link
              href="/admin/gallery/upload"
              className="px-6 py-3 bg-accent-purple text-white rounded-lg hover:bg-accent-purple-light transition-colors"
            >
              + 사진 업로드
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="section-container py-12">
        {galleryItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-text-light mb-4">아직 업로드된 사진이 없습니다</p>
            <Link
              href="/admin/gallery/upload"
              className="inline-block px-6 py-3 bg-accent-purple text-white rounded-lg hover:bg-accent-purple-light transition-colors"
            >
              첫 사진 업로드하기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-text/10"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold text-text mb-2">{item.title}</h3>
                  {item.description && (
                    <p className="text-text-light text-sm mb-4 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(item.id, item.image_url)}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

