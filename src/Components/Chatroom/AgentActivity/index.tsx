import React from 'react';
import { Typography, Button, Tooltip } from 'antd';
import { StopOutlined } from '@ant-design/icons';

import { AgentRunState, AgentStatusEntry, ThinkingEntry } from '@Interfaces';
import { ThinkingBlock } from './ThinkingBlock';

// --- AgentStatusItem ---

interface AgentStatusItemProps {
  entry: AgentStatusEntry;
  isLatest: boolean;
  isActive: boolean;
}

export const AgentStatusItem: React.FC<AgentStatusItemProps> = ({ entry, isLatest, isActive }) => (
  <div className="agent-status-item">
    <span className={`status-dot ${isLatest && isActive ? 'active' : 'done'}`} />
    <Typography.Text type="secondary" style={{ fontSize: '0.7rem', flex: 1 }}>
      {entry.status}
    </Typography.Text>
    <style jsx>{`
      .agent-status-item {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.125rem 0.5rem;
      }
      .status-dot {
        width: 0.25rem;
        height: 0.25rem;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .status-dot.active {
        background-color: #1890ff;
        animation: pulse 1.5s ease-in-out infinite;
      }
      .status-dot.done {
        background-color: #d9d9d9;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
    `}</style>
  </div>
);

// --- AgentThinkingItem ---

interface AgentThinkingItemProps {
  entry: ThinkingEntry;
  isLastThinking: boolean;
  isActive: boolean;
}

export const AgentThinkingItem: React.FC<AgentThinkingItemProps> = ({ entry, isLastThinking, isActive }) => (
  <div className="agent-thinking-item">
    <ThinkingBlock
      text={entry.text}
      isStreaming={isActive && isLastThinking && !entry.done}
      defaultExpanded={isActive && isLastThinking}
    />
    <style jsx>{`
      .agent-thinking-item {
        padding: 0.125rem 0.5rem;
      }
    `}</style>
  </div>
);

// --- AgentActiveHeader ---

interface AgentActiveHeaderProps {
  canEdit: boolean;
  onStop: () => void;
}

export const AgentActiveHeader: React.FC<AgentActiveHeaderProps> = ({ canEdit, onStop }) => (
  <div className="agent-active-header">
    <span className="agent-active-dot" />
    <Typography.Text type="secondary" style={{ fontSize: '0.75rem', flex: 1 }}>
      Bot 正在工作...
    </Typography.Text>
    {canEdit && (
      <Tooltip title="停止 Bot">
        <Button
          type="text"
          size="small"
          icon={<StopOutlined />}
          onClick={onStop}
          style={{ fontSize: '0.75rem', flexShrink: 0 }}
          danger
        />
      </Tooltip>
    )}
    <style jsx>{`
      .agent-active-header {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.375rem 0.5rem;
      }
      .agent-active-dot {
        width: 0.375rem;
        height: 0.375rem;
        border-radius: 50%;
        background-color: #1890ff;
        flex-shrink: 0;
        animation: pulse 1.5s ease-in-out infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }
    `}</style>
  </div>
);

// --- AgentRunSummary ---

interface AgentRunSummaryProps {
  agentRun: AgentRunState;
  onExpand: () => void;
}

export const AgentRunSummary: React.FC<AgentRunSummaryProps> = ({ agentRun, onExpand }) => {
  const { statuses, thinkingBlocks } = agentRun;
  return (
    <div
      className="agent-run-summary"
      onClick={onExpand}
      onKeyDown={e => e.key === 'Enter' && onExpand()}
      role="button"
      tabIndex={0}
    >
      <span className="agent-done-dot" />
      <Typography.Text type="secondary" style={{ fontSize: '0.75rem' }}>
        Bot 完成了 {statuses.length} 个步骤
        {thinkingBlocks.length > 0 && `，${thinkingBlocks.length} 次思考`}
        {' — 点击展开'}
      </Typography.Text>
      <style jsx>{`
        .agent-run-summary {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.5rem;
          cursor: pointer;
          user-select: none;
        }
        .agent-run-summary:hover {
          opacity: 0.7;
        }
        .agent-done-dot {
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 50%;
          background-color: #52c41a;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

// --- AgentRunCollapseToggle ---

interface AgentRunCollapseToggleProps {
  agentRun: AgentRunState;
  onCollapse: () => void;
}

export const AgentRunCollapseToggle: React.FC<AgentRunCollapseToggleProps> = ({ agentRun, onCollapse }) => {
  const { statuses, thinkingBlocks } = agentRun;
  return (
    <div
      className="agent-collapse-toggle"
      onClick={onCollapse}
      onKeyDown={e => e.key === 'Enter' && onCollapse()}
      role="button"
      tabIndex={0}
    >
      <span className="agent-done-dot" />
      <Typography.Text type="secondary" style={{ fontSize: '0.75rem' }}>
        Bot 完成了 {statuses.length} 个步骤
        {thinkingBlocks.length > 0 && `，${thinkingBlocks.length} 次思考`}
        {' — 点击收起'}
      </Typography.Text>
      <style jsx>{`
        .agent-collapse-toggle {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.5rem;
          cursor: pointer;
          user-select: none;
        }
        .agent-collapse-toggle:hover {
          opacity: 0.7;
        }
        .agent-done-dot {
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 50%;
          background-color: #52c41a;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};
