import React, { useState, useRef, useEffect } from 'react';
import { Typography } from 'antd';

interface ThinkingBlockProps {
  text: string;
  isStreaming: boolean;
  defaultExpanded?: boolean;
}

export const ThinkingBlock: React.FC<ThinkingBlockProps> = ({
  text,
  isStreaming,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded || isStreaming);
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when streaming
  useEffect(() => {
    if (isStreaming && expanded && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [text, isStreaming, expanded]);

  // Auto-expand when streaming starts
  useEffect(() => {
    if (isStreaming) setExpanded(true);
  }, [isStreaming]);

  if (!text && !isStreaming) return null;

  return (
    <div className="thinking-block">
      <div
        className="thinking-header"
        onClick={() => setExpanded(!expanded)}
        onKeyDown={e => e.key === 'Enter' && setExpanded(!expanded)}
        role="button"
        tabIndex={0}
      >
        <span className="thinking-icon">{expanded ? '▾' : '▸'}</span>
        <Typography.Text type="secondary" style={{ fontSize: '0.75rem' }}>
          {isStreaming ? '思考中...' : '思考过程'}
        </Typography.Text>
      </div>
      {expanded && (
        <div className="thinking-content" ref={contentRef}>
          <Typography.Text style={{ fontSize: '0.7rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {text}
            {isStreaming && <span className="thinking-cursor">▎</span>}
          </Typography.Text>
        </div>
      )}
      <style jsx>{`
        .thinking-block {
          margin: 0.25rem 0;
          border-left: 2px solid #d9d9d9;
          padding-left: 0.5rem;
        }
        .thinking-header {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          cursor: pointer;
          user-select: none;
          padding: 0.125rem 0;
        }
        .thinking-header:hover {
          opacity: 0.7;
        }
        .thinking-icon {
          font-size: 0.625rem;
          color: #999;
          width: 0.75rem;
        }
        .thinking-content {
          max-height: 12rem;
          overflow-y: auto;
          padding: 0.25rem 0;
          color: #666;
        }
        .thinking-content::-webkit-scrollbar {
          width: 3px;
        }
        .thinking-content::-webkit-scrollbar-thumb {
          background: #d9d9d9;
          border-radius: 2px;
        }
        .thinking-cursor {
          animation: blink 1s infinite;
          color: #1890ff;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};
