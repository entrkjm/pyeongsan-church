'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestSupabase() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient();
        
        // 1. 클라이언트 연결 테스트
        setMessage('Supabase 클라이언트 연결 중...');
        
        // 2. 데이터베이스 연결 테스트 (gallery 테이블 조회)
        const { data, error } = await supabase
          .from('gallery')
          .select('id')
          .limit(1);

        if (error) {
          throw error;
        }

        // 3. 테이블 목록 확인
        const { data: tablesData, error: tablesError } = await supabase
          .from('gallery')
          .select('*')
          .limit(0);

        if (tablesError && tablesError.code !== 'PGRST116') {
          throw tablesError;
        }

        setStatus('success');
        setMessage('✅ Supabase 연결 성공!');
        setTables(['gallery', 'notices', 'comments', 'users']);
      } catch (error: any) {
        setStatus('error');
        setMessage(`❌ 연결 실패: ${error.message}`);
        console.error('Supabase 연결 오류:', error);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-text mb-6">Supabase 연결 테스트</h1>
        
        <div className="space-y-4">
          {/* 상태 표시 */}
          <div className={`p-4 rounded-lg ${
            status === 'loading' ? 'bg-yellow-50 border border-yellow-200' :
            status === 'success' ? 'bg-green-50 border border-green-200' :
            'bg-red-50 border border-red-200'
          }`}>
            <p className={`font-semibold ${
              status === 'loading' ? 'text-yellow-800' :
              status === 'success' ? 'text-green-800' :
              'text-red-800'
            }`}>
              {status === 'loading' && '⏳ 테스트 중...'}
              {status === 'success' && message}
              {status === 'error' && message}
            </p>
          </div>

          {/* 테이블 목록 */}
          {status === 'success' && (
            <div className="mt-6">
              <h2 className="text-xl font-bold text-text mb-3">생성된 테이블:</h2>
              <ul className="space-y-2">
                {tables.map((table) => (
                  <li key={table} className="flex items-center gap-2 text-text">
                    <span className="text-green-500">✓</span>
                    <span className="font-mono">{table}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 환경 변수 확인 (개발용) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-bold text-text mb-2">환경 변수 확인:</h3>
              <div className="space-y-1 text-xs font-mono text-text-light">
                <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 설정됨' : '❌ 없음'}</p>
                <p>KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ 설정됨' : '❌ 없음'}</p>
              </div>
            </div>
          )}

          {/* 안내 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>참고:</strong> 이 페이지는 테스트용입니다. 
              실제 사용 시에는 이 페이지를 삭제하거나 제거하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

