'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DOMPurify from 'dompurify';

interface Notice {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface Comment {
  id: string;
  post_type: string;
  post_id: string;
  author_name: string | null;
  content: string;
  created_at: string;
}

export default function AdminNotices() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // 댓글 개수 로드
  async function loadCommentCounts(noticeIds: string[]) {
    const supabase = createClient();
    const counts: Record<string, number> = {};

    for (const noticeId of noticeIds) {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_type', 'notice')
        .eq('post_id', noticeId);

      if (!error && count !== null) {
        counts[noticeId] = count;
      }
    }

    setCommentCounts(counts);
  }

  useEffect(() => {
    async function checkAuthAndLoadNotices() {
      const supabase = createClient();
      
      // 인증 확인
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
        return;
      }
      setUser(user);

      // 공지 데이터 로드
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('공지 로드 오류:', error);
      } else {
        setNotices(data || []);
        // 각 공지의 댓글 개수 로드
        if (data && data.length > 0) {
          loadCommentCounts(data.map(n => n.id));
        }
      }
      setLoading(false);
    }

    checkAuthAndLoadNotices();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    const supabase = createClient();
    
    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // 목록에서 제거
      setNotices(notices.filter(notice => notice.id !== id));
    } catch (error: any) {
      alert('삭제 실패: ' + error.message);
    }
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    const supabase = createClient();
    
    try {
      const { error } = await supabase
        .from('notices')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      // 목록 업데이트
      setNotices(notices.map(notice => 
        notice.id === id ? { ...notice, published: !currentStatus } : notice
      ));
    } catch (error: any) {
      alert('상태 변경 실패: ' + error.message);
    }
  };

  const loadComments = async (noticeId: string) => {
    setLoadingComments(true);
    setSelectedNoticeId(noticeId);
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_type', 'notice')
        .eq('post_id', noticeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      console.error('댓글 로드 오류:', error);
      alert('댓글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDeleteComment = async (commentId: string, noticeId: string) => {
    if (!confirm('정말 이 댓글을 삭제하시겠습니까?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      // 댓글 목록에서 제거
      setComments(comments.filter(c => c.id !== commentId));
      // 댓글 개수 업데이트
      setCommentCounts(prev => ({
        ...prev,
        [noticeId]: (prev[noticeId] || 0) - 1
      }));
    } catch (error: any) {
      alert('댓글 삭제 실패: ' + error.message);
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
              <h1 className="text-2xl font-bold text-text">공지 관리</h1>
            </div>
            <Link
              href="/admin/notices/new"
              className="px-6 py-3 rounded-md transition-all duration-200 font-bold shadow-sm hover:shadow-md"
            style={{ color: '#5D4E37' }}
            >
              + 공지 작성
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="section-container py-12">
        {notices.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-text-light mb-4">아직 작성된 공지가 없습니다</p>
            <Link
              href="/admin/notices/new"
              className="inline-block px-6 py-3.5 rounded-md transition-all duration-200 font-bold shadow-sm hover:shadow-md"
            style={{ color: '#5D4E37' }}
            >
              첫 공지 작성하기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-text/5 hover:shadow-lg transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-text">{notice.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            notice.published
                              ? 'bg-success/20 text-success-dark'
                              : 'bg-text/10 text-text-light'
                          }`}
                        >
                          {notice.published ? '공개' : '비공개'}
                        </span>
                        {commentCounts[notice.id] > 0 && (
                          <span className="px-3 py-1 rounded-md text-sm font-medium bg-base text-text-light">
                            댓글 {commentCounts[notice.id]}개
                          </span>
                        )}
                      </div>
                      <p className="text-text-light text-sm mb-2">
                        {new Date(notice.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <div 
                        className="text-text-light line-clamp-2"
                        dangerouslySetInnerHTML={{ 
                          __html: DOMPurify.sanitize(
                            notice.content.substring(0, 150) + (notice.content.length > 150 ? '...' : ''),
                            { ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a'] }
                          )
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap items-center">
                    <Link
                      href={`/admin/notices/${notice.id}/edit`}
                      className="px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleTogglePublished(notice.id, notice.published)}
                      className="px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                    >
                      {notice.published ? '비공개' : '공개'}
                    </button>
                    {commentCounts[notice.id] > 0 && (
                      <button
                        onClick={() => loadComments(notice.id)}
                        className="px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                      >
                        댓글 관리 ({commentCounts[notice.id]})
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                      style={{ color: '#8B6F47' }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* 댓글 관리 모달 */}
        {selectedNoticeId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-text/10 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-text">
                  댓글 관리 ({comments.length}개)
                </h2>
                <button
                  onClick={() => {
                    setSelectedNoticeId(null);
                    setComments([]);
                  }}
                  className="text-text-light hover:text-text transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {loadingComments ? (
                  <div className="text-center py-8">
                    <p className="text-text-light">댓글 로딩 중...</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8 bg-base-light rounded-lg">
                    <p className="text-text-light">댓글이 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-base-light rounded-lg p-4 border border-text/5"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-text">
                              {comment.author_name || '익명'}
                            </span>
                            <span className="text-text-light text-sm">
                              {new Date(comment.created_at).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteComment(comment.id, selectedNoticeId)}
                            className="px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium shadow-sm hover:shadow"
            style={{ color: '#8B6F47' }}
                          >
                            삭제
                          </button>
                        </div>
                        <p className="text-text leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

