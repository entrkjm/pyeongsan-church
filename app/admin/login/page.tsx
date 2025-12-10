'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Admin 로그인</h1>
          <p className="text-text-light">무안 평산교회 관리자 페이지</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-text/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent text-text"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-text/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent text-text"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-accent-purple text-white py-3 rounded-lg font-semibold hover:bg-accent-purple-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-text-light hover:text-text transition-colors"
          >
            ← 메인 페이지로 돌아가기
          </a>
        </div>
      </motion.div>
    </div>
  );
}

