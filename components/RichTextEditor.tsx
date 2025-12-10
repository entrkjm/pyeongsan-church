'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import DOMPurify from 'dompurify';

// React Quill을 동적으로 로드 (SSR 방지)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = '내용을 입력하세요' }: RichTextEditorProps) {
  // 툴바 설정 (사용하기 쉬운 필수 기능만)
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],  // 제목
        ['bold', 'italic', 'underline'],     // 굵게, 기울임, 밑줄
        [{ 'list': 'ordered'}, { 'list': 'bullet' }], // 순서 목록, 불릿 목록
        ['link'],                            // 링크
        ['clean']                            // 서식 제거
      ],
    },
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ];

  // HTML sanitization (XSS 방지)
  const handleChange = (content: string) => {
    const sanitized = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
    });
    onChange(sanitized);
  };

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
        }}
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border-color: rgba(29, 29, 31, 0.1);
          font-size: 16px;
          min-height: 300px;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          border-color: rgba(29, 29, 31, 0.1);
          background-color: #fafafa;
        }
        .rich-text-editor .ql-toolbar .ql-stroke {
          stroke: #1d1d1f;
        }
        .rich-text-editor .ql-toolbar .ql-fill {
          fill: #1d1d1f;
        }
        .rich-text-editor .ql-toolbar button:hover,
        .rich-text-editor .ql-toolbar button.ql-active {
          color: #5D4E37;
        }
        .rich-text-editor .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #5D4E37;
        }
        .rich-text-editor .ql-toolbar button:hover .ql-fill,
        .rich-text-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #5D4E37;
        }
        .rich-text-editor .ql-editor {
          min-height: 300px;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #6e6e73;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}

