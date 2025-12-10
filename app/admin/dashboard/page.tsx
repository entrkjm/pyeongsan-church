'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/admin/login');
        return;
      }

      setUser(user);
      setLoading(false);
    }

    getUser();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
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
            <h1 className="text-2xl font-bold text-text">Admin 대시보드</h1>
            <div className="flex items-center gap-4">
              <span className="text-text-light">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="section-container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-text mb-8">관리 메뉴</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 갤러리 관리 카드 */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-lg shadow-lg p-8 border border-text/10"
            >
              <h3 className="text-2xl font-bold text-text mb-4">갤러리 관리</h3>
              <p className="text-text-light mb-6">
                교회 행사 사진을 업로드하고 관리합니다.
              </p>
              <Link
                href="/admin/gallery"
                className="inline-block px-6 py-3 bg-accent-purple text-white rounded-lg hover:bg-accent-purple-light transition-colors"
              >
                갤러리 관리하기 →
              </Link>
            </motion.div>

            {/* 공지 관리 카드 */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-lg shadow-lg p-8 border border-text/10"
            >
              <h3 className="text-2xl font-bold text-text mb-4">공지 관리</h3>
              <p className="text-text-light mb-6">
                교회 공지를 작성하고 관리합니다.
              </p>
              <Link
                href="/admin/notices"
                className="inline-block px-6 py-3 bg-accent-purple text-white rounded-lg hover:bg-accent-purple-light transition-colors"
              >
                공지 관리하기 →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

