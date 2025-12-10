'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface ImageFile {
  file: File;
  preview: string;
  url?: string;
}

export default function UploadGallery() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const newImages: ImageFile[] = selectedFiles.map(file => {
      const preview = URL.createObjectURL(file);
      return { file, preview };
    });

    setImages(prev => [...prev, ...newImages]);
    // 첫 번째 이미지를 기본 대표 이미지로 설정
    if (images.length === 0 && thumbnailIndex === 0) {
      setThumbnailIndex(0);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    // 대표 이미지 인덱스 조정
    if (thumbnailIndex >= newImages.length) {
      setThumbnailIndex(Math.max(0, newImages.length - 1));
    } else if (index < thumbnailIndex) {
      setThumbnailIndex(thumbnailIndex - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0 || !title) {
      setError('제목과 최소 1개 이상의 이미지를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const supabase = createClient();

      // 1. 사용자 확인
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
        return;
      }

      // 2. 모든 이미지 업로드
      const uploadedUrls: string[] = [];
      for (const image of images) {
        const fileExt = image.file.name.split('.').pop();
        const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(fileName, image.file);

        if (uploadError) throw uploadError;

        // Public URL 가져오기
        const { data: urlData } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(urlData.publicUrl);
      }

      // 3. 대표 이미지 URL
      const thumbnailUrl = uploadedUrls[thumbnailIndex];

      // 4. 데이터베이스에 저장
      const { error: dbError } = await supabase
        .from('gallery')
        .insert({
          title,
          description: description || null,
          images: uploadedUrls, // JSON 배열
          thumbnail_url: thumbnailUrl,
          image_url: thumbnailUrl, // 하위 호환성을 위해 유지
        });

      if (dbError) throw dbError;

      // 5. 성공 시 갤러리 목록으로 이동
      router.push('/admin/gallery');
    } catch (err: any) {
      setError(err.message || '업로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base">
      {/* 헤더 */}
      <header className="bg-white border-b border-text/10">
        <div className="section-container">
          <div className="flex items-center justify-between h-20">
            <Link href="/admin/gallery" className="text-text-light hover:text-text">
              ← 갤러리 관리
            </Link>
            <h1 className="text-2xl font-bold text-text">사진 업로드</h1>
            <div></div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="section-container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8 md:p-10 space-y-6 border border-text/5">
            {error && (
              <div className="bg-error-bg border border-error-border rounded-md p-4">
                <p className="text-error-text text-sm">{error}</p>
              </div>
            )}

            {/* 이미지 업로드 (여러 개) */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                이미지 * (여러 개 선택 가능)
              </label>
              <div className="border-2 border-dashed border-text/10 rounded-md p-4 text-center hover:border-accent-primary/30 transition-colors duration-200">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFilesChange}
                  className="hidden"
                  id="file-upload"
                  multiple
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block py-4"
                >
                  <div className="space-y-2">
                    <p className="text-text-light">클릭하여 이미지 선택 (여러 개 가능)</p>
                    <p className="text-sm text-text-light">또는 드래그 앤 드롭</p>
                  </div>
                </label>
              </div>

              {/* 업로드된 이미지 미리보기 */}
              {images.length > 0 && (
                <div className="mt-4 space-y-4">
                  <p className="text-sm text-text-light">업로드된 이미지 ({images.length}개)</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 ${
                          thumbnailIndex === index
                            ? 'border-accent-primary-dark'
                            : 'border-text/10'
                        }`}
                      >
                        <img
                          src={image.preview}
                          alt={`미리보기 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {thumbnailIndex === index && (
                          <div className="absolute top-2 left-2 bg-accent-primary-dark text-white px-2 py-1 rounded text-xs font-bold">
                            대표
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                          aria-label="이미지 제거"
                        >
                          ×
                        </button>
                        <button
                          type="button"
                          onClick={() => setThumbnailIndex(index)}
                          className="absolute bottom-2 left-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs hover:bg-black/70 transition-colors"
                        >
                          {thumbnailIndex === index ? '대표 이미지' : '대표로 설정'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 제목 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text mb-2">
                제목 *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border border-text/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary/50 text-text bg-white transition-all"
                placeholder="예: 2024년 여름 수련회"
              />
            </div>

            {/* 설명 */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text mb-2">
                설명 (선택)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-text/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary/50 text-text bg-white transition-all"
                placeholder="사진에 대한 설명을 입력하세요"
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-4">
              <Link
                href="/admin/gallery"
                className="flex-1 px-6 py-3.5 text-text rounded-md shadow-sm hover:shadow-md transition-all duration-200 text-center font-medium"
              >
                취소
              </Link>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                className="flex-1 px-6 py-3.5 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-sm hover:shadow-md"
            style={{ color: '#5D4E37' }}
              >
                {loading ? '업로드 중...' : '업로드'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

