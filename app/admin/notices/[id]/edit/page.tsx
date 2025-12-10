'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';

interface Notice {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  published: boolean;
}

export default function EditNotice() {
  const router = useRouter();
  const params = useParams();
  const noticeId = params.id as string;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadNotice() {
      const supabase = createClient();
      
      // 인증 확인
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
        return;
      }

      // 공지 데이터 로드
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('id', noticeId)
        .single();

      if (error) {
        setError('공지를 불러올 수 없습니다.');
        setLoading(false);
        return;
      }

      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setPublished(data.published);
        setExistingImageUrl(data.image_url);
        setPreview(data.image_url);
      }
      setLoading(false);
    }

    if (noticeId) {
      loadNotice();
    }
  }, [noticeId, router]);

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
    // HTML 태그 제거 후 텍스트만 확인
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    if (!title || !textContent) {
      setError('제목과 내용을 입력해주세요.');
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

      let imageUrl = existingImageUrl;

      // 2. 새 이미지가 있으면 업로드
      if (file) {
        // 기존 이미지 삭제 (있으면)
        if (existingImageUrl) {
          const fileName = existingImageUrl.split('/').pop();
          if (fileName) {
            await supabase.storage.from('gallery-images').remove([`notices/${fileName}`]);
          }
        }

        // 새 이미지 업로드
        const fileExt = file.name.split('.').pop();
        const fileName = `notices/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Public URL 가져오기
        const { data: urlData } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      // 3. 데이터베이스 업데이트
      const { error: dbError } = await supabase
        .from('notices')
        .update({
          title,
          content,
          image_url: imageUrl,
          published,
          updated_at: new Date().toISOString(),
        })
        .eq('id', noticeId);

      if (dbError) throw dbError;

      // 4. 성공 시 공지 목록으로 이동
      router.push('/admin/notices');
    } catch (err: any) {
      setError(err.message || '공지 수정에 실패했습니다.');
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

  return (
    <div className="min-h-screen bg-base">
      {/* 헤더 */}
      <header className="bg-white border-b border-text/10">
        <div className="section-container">
          <div className="flex items-center justify-between h-20">
            <Link href="/admin/notices" className="text-text-light hover:text-text">
              ← 공지 관리
            </Link>
            <h1 className="text-2xl font-bold text-text">공지 수정</h1>
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
                placeholder="예: 2024년 12월 교회 공지"
              />
            </div>

            {/* 내용 */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-text mb-2">
                내용 *
              </label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="공지 내용을 입력하세요. 굵게, 기울임, 목록, 링크 등을 사용할 수 있습니다."
              />
            </div>

            {/* 이미지 업로드 (선택) */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                이미지 (선택)
              </label>
              <div className="border-2 border-dashed border-text/10 rounded-md p-8 text-center hover:border-accent-primary/30 transition-colors duration-200">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
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
              {existingImageUrl && !file && (
                <button
                  type="button"
                  onClick={() => {
                    setExistingImageUrl(null);
                    setPreview(null);
                  }}
                  className="mt-2 text-sm text-error-text hover:underline"
                >
                  이미지 제거
                </button>
              )}
            </div>

            {/* 공개 설정 */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded border-text/20 text-accent-primary focus:ring-accent-primary/30"
              />
              <label htmlFor="published" className="text-sm font-medium text-text">
                공개로 설정
              </label>
            </div>

            {/* 버튼 */}
            <div className="flex gap-4">
              <Link
                href="/admin/notices"
                className="flex-1 px-6 py-3.5 text-text rounded-md shadow-sm hover:shadow-md transition-all duration-200 text-center font-medium"
              >
                취소
              </Link>
              <motion.button
                type="submit"
                disabled={saving}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                className="flex-1 px-6 py-3.5 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-sm hover:shadow-md"
            style={{ color: '#5D4E37' }}
              >
                {saving ? '저장 중...' : '저장하기'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

