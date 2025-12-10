'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';

interface Comment {
  id: string;
  post_type: 'gallery' | 'notice';
  post_id: string;
  author_name: string | null;
  content: string;
  created_at: string;
}

interface CommentsProps {
  postType: 'gallery' | 'notice';
  postId: string;
}

export default function Comments({ postType, postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin 체크 및 댓글 로드
  useEffect(() => {
    checkAdmin();
    loadComments();
  }, [postType, postId]);

  async function checkAdmin() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(!!user);
    } catch (err) {
      setIsAdmin(false);
    }
  }

  async function loadComments() {
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select('*')
        .eq('post_type', postType)
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('댓글 로드 오류:', fetchError);
        setError('댓글을 불러오는 중 오류가 발생했습니다.');
      } else {
        setComments(data || []);
      }
    } catch (err: any) {
      console.error('댓글 로드 중 예외 발생:', err);
      setError('댓글을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }

  // 댓글 작성
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from('comments')
        .insert({
          post_type: postType,
          post_id: postId,
          author_name: authorName.trim() || null,
          content: content.trim(),
        });

      if (insertError) throw insertError;

      // 성공 시 폼 초기화 및 댓글 다시 로드
      setContent('');
      setAuthorName('');
      await loadComments();
    } catch (err: any) {
      console.error('댓글 작성 오류:', err);
      setError('댓글 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  // 댓글 삭제
  async function handleDelete(commentId: string) {
    if (!confirm('정말 이 댓글을 삭제하시겠습니까?')) return;

    try {
      const supabase = createClient();
      
      // Admin 확인
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('삭제 권한이 없습니다.');
        return;
      }

      const { error: deleteError } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (deleteError) throw deleteError;

      // 댓글 목록에서 제거
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err: any) {
      console.error('댓글 삭제 오류:', err);
      alert('댓글 삭제에 실패했습니다: ' + err.message);
    }
  }

  return (
    <div className="pt-4 border-t border-text/10">
      <h2 className="text-xl md:text-2xl font-bold text-text mb-4">
        댓글 ({comments.length})
      </h2>

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleSubmit} className="mb-6">
        {error && (
          <div className="bg-error-bg border border-error-border rounded-md p-3 mb-3">
            <p className="text-error-text text-xs">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="이름 (선택사항)"
            className="w-full px-3 py-2 text-sm border border-text/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary/50 text-text bg-white transition-all"
            maxLength={20}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력하세요..."
            rows={3}
            required
            className="w-full px-3 py-2 text-sm border border-text/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary/50 text-text bg-white transition-all resize-none"
            maxLength={500}
          />
        </div>
        <div className="mt-3 flex justify-end">
          <motion.button
            type="submit"
            disabled={submitting || !content.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
            style={{ color: '#5D4E37' }}
          >
            {submitting ? '작성 중...' : '작성'}
          </motion.button>
        </div>
      </form>

      {/* 댓글 목록 */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-text-light">댓글 로딩 중...</p>
        </div>
             ) : comments.length === 0 ? (
               <div className="text-center py-6 bg-base-light rounded-lg">
                 <p className="text-text-light text-sm">아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
               </div>
             ) : (
               <div className="space-y-3">
          {comments.map((comment, index) => (
                   <motion.div
                     key={comment.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.3, delay: index * 0.05 }}
                     className="bg-base-light rounded-lg p-3 md:p-4 border border-text/5"
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
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-text-light hover:text-red-500 transition-colors text-sm px-2 py-1 rounded hover:bg-red-50"
                    title="댓글 삭제"
                  >
                    삭제
                  </button>
                )}
              </div>
              <p className="text-text leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

