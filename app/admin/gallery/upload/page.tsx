'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function UploadGallery() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      setError('제목과 이미지를 입력해주세요.');
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

      // 2. 파일 업로드 (Storage)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 3. Public URL 가져오기
      const { data: urlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName);

      // 4. 데이터베이스에 저장
      const { error: dbError } = await supabase
        .from('gallery')
        .insert({
          title,
          description: description || null,
          image_url: urlData.publicUrl,
          created_by: user.id,
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
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* 이미지 업로드 */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                이미지 *
              </label>
              <div className="border-2 border-dashed border-text/20 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  required
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block"
                >
                  {preview ? (
                    <div className="relative w-full max-w-md mx-auto aspect-[4/3] rounded-lg overflow-hidden">
                      <img
                        src={preview}
                        alt="미리보기"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-text-light">클릭하여 이미지 선택</p>
                      <p className="text-sm text-text-light">또는 드래그 앤 드롭</p>
                    </div>
                  )}
                </label>
              </div>
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
                className="w-full px-4 py-3 border border-text/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent text-text"
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
                className="w-full px-4 py-3 border border-text/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent text-text"
                placeholder="사진에 대한 설명을 입력하세요"
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-4">
              <Link
                href="/admin/gallery"
                className="flex-1 px-6 py-3 border border-text/20 text-text rounded-lg hover:bg-base transition-colors text-center"
              >
                취소
              </Link>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 px-6 py-3 bg-accent-purple text-white rounded-lg hover:bg-accent-purple-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

