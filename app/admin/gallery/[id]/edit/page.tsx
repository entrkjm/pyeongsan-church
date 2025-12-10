'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface ImageFile {
  file: File;
  preview: string;
  url?: string;
}

interface ExistingImage {
  url: string;
  index: number;
}

export default function EditGallery() {
  const router = useRouter();
  const params = useParams();
  const galleryId = params.id as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newImages, setNewImages] = useState<ImageFile[]>([]);
  const [thumbnailIndex, setThumbnailIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadGallery() {
      const supabase = createClient();
      
      // 인증 확인
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
        return;
      }

      // 갤러리 데이터 로드
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('id', galleryId)
        .single();

      if (error) {
        setError('갤러리를 불러올 수 없습니다.');
        setLoading(false);
        return;
      }

      if (data) {
        setTitle(data.title);
        setDescription(data.description || '');
        
        // 기존 이미지 설정
        const images: string[] = Array.isArray(data.images) && data.images.length > 0
          ? data.images
          : data.thumbnail_url
          ? [data.thumbnail_url]
          : [];
        
        setExistingImages(images.map((url, index) => ({ url, index })));
        
        // 대표 이미지 인덱스 설정
        if (data.thumbnail_url) {
          const thumbIndex = images.findIndex(url => url === data.thumbnail_url);
          setThumbnailIndex(thumbIndex >= 0 ? thumbIndex : 0);
        }
      }
      setLoading(false);
    }

    if (galleryId) {
      loadGallery();
    }
  }, [galleryId, router]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const newImageFiles: ImageFile[] = selectedFiles.map(file => {
      const preview = URL.createObjectURL(file);
      return { file, preview };
    });

    setNewImages(prev => [...prev, ...newImageFiles]);
  };

  const removeExistingImage = (index: number) => {
    const newImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(newImages);
    // 대표 이미지 인덱스 조정
    const totalImages = newImages.length + newImages.length;
    if (thumbnailIndex >= totalImages) {
      setThumbnailIndex(Math.max(0, totalImages - 1));
    } else if (index < thumbnailIndex) {
      setThumbnailIndex(thumbnailIndex - 1);
    }
  };

  const removeNewImage = (index: number) => {
    const newImageList = newImages.filter((_, i) => i !== index);
    setNewImages(newImageList);
    // 대표 이미지 인덱스 조정
    const totalImages = existingImages.length + newImageList.length;
    if (thumbnailIndex >= totalImages) {
      setThumbnailIndex(Math.max(0, totalImages - 1));
    } else if (index + existingImages.length < thumbnailIndex) {
      setThumbnailIndex(thumbnailIndex - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError('제목을 입력해주세요.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const supabase = createClient();

      // 1. 사용자 확인
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
        return;
      }

      // 2. 새 이미지 업로드
      const uploadedUrls: string[] = [];
      for (const image of newImages) {
        const fileExt = image.file.name.split('.').pop();
        const fileName = `gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(fileName, image.file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(urlData.publicUrl);
      }

      // 3. 최종 이미지 배열 (기존 + 새로 업로드)
      const allImages = [...existingImages.map(img => img.url), ...uploadedUrls];
      
      if (allImages.length === 0) {
        setError('최소 1개 이상의 이미지가 필요합니다.');
        setSaving(false);
        return;
      }

      // 4. 대표 이미지 URL
      const thumbnailUrl = allImages[thumbnailIndex];

      // 5. 데이터베이스 업데이트
      const { error: dbError } = await supabase
        .from('gallery')
        .update({
          title,
          description: description || null,
          images: allImages,
          thumbnail_url: thumbnailUrl,
          image_url: thumbnailUrl, // 하위 호환성
        })
        .eq('id', galleryId);

      if (dbError) throw dbError;

      // 6. 성공 시 갤러리 목록으로 이동
      router.push('/admin/gallery');
    } catch (err: any) {
      setError(err.message || '수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="text-text">로딩 중...</p>
      </div>
    );
  }

  const allImages = [...existingImages, ...newImages.map((img, idx) => ({ url: img.preview, index: existingImages.length + idx }))];

  return (
    <div className="min-h-screen bg-base">
      {/* 헤더 */}
      <header className="bg-white border-b border-text/10">
        <div className="section-container">
          <div className="flex items-center justify-between h-20">
            <Link href="/admin/gallery" className="text-text-light hover:text-text">
              ← 갤러리 관리
            </Link>
            <h1 className="text-2xl font-bold text-text">갤러리 수정</h1>
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

            {/* 기존 이미지 */}
            {existingImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  기존 이미지
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {existingImages.map((img, index) => (
                    <div
                      key={index}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 ${
                        thumbnailIndex === index
                          ? 'border-accent-primary-dark'
                          : 'border-text/10'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`기존 이미지 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {thumbnailIndex === index && (
                        <div className="absolute top-2 left-2 bg-accent-primary-dark text-white px-2 py-1 rounded text-xs font-bold">
                          대표
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
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

            {/* 새 이미지 추가 */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                새 이미지 추가 (선택)
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
                    <p className="text-text-light">클릭하여 이미지 추가 (여러 개 가능)</p>
                  </div>
                </label>
              </div>

              {/* 새 이미지 미리보기 */}
              {newImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-text-light mb-2">추가할 이미지 ({newImages.length}개)</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {newImages.map((image, index) => {
                      const totalIndex = existingImages.length + index;
                      return (
                        <div
                          key={index}
                          className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 ${
                            thumbnailIndex === totalIndex
                              ? 'border-accent-primary-dark'
                              : 'border-text/10'
                          }`}
                        >
                          <img
                            src={image.preview}
                            alt={`새 이미지 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {thumbnailIndex === totalIndex && (
                            <div className="absolute top-2 left-2 bg-accent-primary-dark text-white px-2 py-1 rounded text-xs font-bold">
                              대표
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                            aria-label="이미지 제거"
                          >
                            ×
                          </button>
                          <button
                            type="button"
                            onClick={() => setThumbnailIndex(totalIndex)}
                            className="absolute bottom-2 left-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs hover:bg-black/70 transition-colors"
                          >
                            {thumbnailIndex === totalIndex ? '대표 이미지' : '대표로 설정'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
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
                disabled={saving || allImages.length === 0}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                className="flex-1 px-6 py-3.5 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-sm hover:shadow-md"
            style={{ color: '#5D4E37' }}
              >
                {saving ? '수정 중...' : '수정하기'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

