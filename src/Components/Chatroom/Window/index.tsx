import React, { useState, createRef, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { Input, Button, Typography, Empty, Modal } from 'antd';
import {
  SendOutlined,
  CloseOutlined,
  MessageTwoTone,
  ExpandOutlined,
  CompressOutlined,
} from '@ant-design/icons';

import { getChatroomSocket } from '@Services/Socket/chatroom';
import { getNewsroomSocket } from '@Services/Socket/newsroom';
import { getChatId } from '@Services/Utils';
import { RedstoneService } from '@Services';
import { del } from '@Services/API/Http';
import { ChatroomActions, NewsroomActions } from '@Actions';
import { ChatMessage, AgentStatusEntry, ThinkingEntry, AgentRunState } from '@Interfaces';
import {
  getChatroomMessages,
  getEvent,
  getEventOwner,
  getAgentRun,
  canCurrentClientEditEvent,
  getNewsroomRoles,
} from '@Selectors';

import { ChatroomMessage } from '../Message';
import {
  AgentStatusItem,
  AgentThinkingItem,
  AgentActiveHeader,
  AgentRunSummary,
  AgentRunCollapseToggle,
} from '../AgentActivity';
import { WindowProps } from './Window';

type TimelineItem =
  | { kind: 'message'; message: ChatMessage; timestamp: string }
  | { kind: 'status'; entry: AgentStatusEntry; index: number; isLatest: boolean; isActive: boolean; timestamp: string }
  | { kind: 'thinking'; entry: ThinkingEntry; index: number; isLastThinking: boolean; isActive: boolean; timestamp: string }
  | { kind: 'agent-header'; canEdit: boolean; timestamp: string }
  | { kind: 'agent-summary'; agentRun: AgentRunState; timestamp: string }
  | { kind: 'agent-collapse'; agentRun: AgentRunState; timestamp: string };

let cachedBotClientId: number | null = null;

export const ChatroomWindow: React.FC<WindowProps> = ({ type, ids, onClose, presetMessage }) => {
  const socket = getChatroomSocket(type, ids);
  const store = useStore();
  const chatId = getChatId(type, ids);
  const dispatch = useDispatch();
  const isNewsroom = type === 'newsroom';
  const eventId = isNewsroom ? (ids as number) : 0;
  const event = useSelector(getEvent(isNewsroom ? -eventId : 0));
  const eventOwner = useSelector(getEventOwner(isNewsroom ? -eventId : 0));
  const messages = useSelector(getChatroomMessages(chatId));
  const agentRun = useSelector(getAgentRun(isNewsroom ? eventId : undefined));
  const canEdit = useSelector(canCurrentClientEditEvent(isNewsroom ? eventId : undefined));
  const roles = useSelector(getNewsroomRoles(isNewsroom ? eventId : 0));
  const [message, setMessage] = useState(presetMessage || '');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTop, setIsTop] = useState(false);
  const [stopConfirmVisible, setStopConfirmVisible] = useState(false);
  const [agentHistoryExpanded, setAgentHistoryExpanded] = useState(false);
  const [expanded, setExpanded] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`chatroom:expanded:${chatId}`) === '1';
  });

  const [thinkingLoadedForRun, setThinkingLoadedForRun] = useState<string | null>(null);

  // Reset agent history expansion when a new run starts
  useEffect(() => {
    setAgentHistoryExpanded(false);
    setThinkingLoadedForRun(null);
  }, [agentRun?.runId]);

  // Load thinking blocks on demand when expanding a completed run
  const handleExpandAgentHistory = useCallback(async () => {
    setAgentHistoryExpanded(true);

    // If thinking blocks haven't been loaded yet and this is a completed run, load them
    if (
      agentRun &&
      !agentRun.isActive &&
      thinkingLoadedForRun !== agentRun.runId &&
      eventId &&
      agentRun.runId
    ) {
      try {
        const { statuses: thinkingRecords } = await RedstoneService.loadAgentThinking(
          eventId,
          agentRun.runId
        );
        if (thinkingRecords.length > 0) {
          // Replay in chronological order
          const chronological = [...thinkingRecords].reverse();
          for (const record of chronological) {
            dispatch(NewsroomActions.AppendAgentThinking(-eventId, record.runId, record.status));
            dispatch(NewsroomActions.FinishAgentThinking(-eventId, record.runId));
          }
        }
        setThinkingLoadedForRun(agentRun.runId);
      } catch (err) {
        // Non-critical — thinking blocks just won't show
      }
    }
  }, [agentRun, eventId, dispatch, thinkingLoadedForRun]);

  // Build unified timeline: merge messages + agent entries, sorted descending
  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [];

    // Add all chat messages
    for (const m of messages) {
      items.push({ kind: 'message', message: m, timestamp: m.createdAt });
    }

    // Add agent entries if agentRun exists
    if (agentRun && (agentRun.statuses.length > 0 || agentRun.thinkingBlocks.length > 0 || agentRun.isActive)) {
      const lastStatusIndex = agentRun.statuses.length - 1;
      const lastThinkingIndex = agentRun.thinkingBlocks.length - 1;

      for (const entry of agentRun.timeline) {
        if (entry.type === 'status') {
          const s = agentRun.statuses[entry.index];
          if (s) {
            items.push({
              kind: 'status',
              entry: s,
              index: entry.index,
              isLatest: entry.index === lastStatusIndex,
              isActive: agentRun.isActive,
              timestamp: s.timestamp,
            });
          }
        } else if (entry.type === 'thinking') {
          const t = agentRun.thinkingBlocks[entry.index];
          if (t) {
            items.push({
              kind: 'thinking',
              entry: t,
              index: entry.index,
              isLastThinking: entry.index === lastThinkingIndex,
              isActive: agentRun.isActive,
              timestamp: t.timestamp,
            });
          }
        }
      }

      // Active header: sentinel timestamp ensures it's always first in DOM (visual bottom)
      if (agentRun.isActive) {
        items.push({
          kind: 'agent-header',
          canEdit,
          timestamp: '9999-12-31T23:59:59.999Z',
        });
      }
    }

    // Sort descending by timestamp (newest first — matches column-reverse rendering)
    items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    return items;
  }, [messages, agentRun, canEdit]);

  // For completed runs: collapse/expand agent entries
  const displayItems = useMemo(() => {
    if (!agentRun || agentRun.isActive) {
      return timelineItems;
    }

    // Completed run timestamps
    const firstTimestamp = agentRun.statuses[0]?.timestamp || agentRun.thinkingBlocks[0]?.timestamp;
    const lastStatus = agentRun.statuses[agentRun.statuses.length - 1];
    const lastThinking = agentRun.thinkingBlocks[agentRun.thinkingBlocks.length - 1];
    const lastTimestamp = [lastStatus?.timestamp, lastThinking?.timestamp]
      .filter(Boolean)
      .sort()
      .pop() || firstTimestamp;

    if (!lastTimestamp) return timelineItems;

    if (agentHistoryExpanded) {
      // Expanded: show all timeline items + a collapse toggle at the end (latest position)
      const items = [...timelineItems];
      items.push({
        kind: 'agent-collapse',
        agentRun,
        timestamp: lastTimestamp,
      });
      items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      return items;
    }

    // Collapsed: replace agent entries with a single summary at the latest position
    const filtered = timelineItems.filter(
      item => item.kind === 'message'
    ) as TimelineItem[];

    filtered.push({
      kind: 'agent-summary',
      agentRun,
      timestamp: lastTimestamp,
    });

    filtered.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    return filtered;
  }, [timelineItems, agentRun, agentHistoryExpanded]);

  const divRef = createRef<HTMLDivElement>();

  const loadMore = async () => {
    if (isTop || loading) return;
    setLoading(true);
    try {
      const earliest = messages[messages.length - 1].createdAt;
      const moreMessages = await RedstoneService.loadChatMessages(type, ids, new Date(earliest));
      for (let i = 0; i < moreMessages.length; i += 1) {
        dispatch(ChatroomActions.AddMessage(chatId, moreMessages[i]));
      }
      if (moreMessages.length < 30) {
        setIsTop(true);
      }
    } catch (err) {
      // Do nothing;
    } finally {
      setLoading(false);
    }
  };

  let div: HTMLDivElement;
  useEffect(() => {
    if (!divRef.current) return () => {};
    div = divRef.current;

    const update = () => {
      if (div.scrollHeight < div.offsetHeight - div.scrollTop + 200) {
        loadMore();
      }
    };
    update();
    div.addEventListener('scroll', update);

    return () => {
      div.removeEventListener('scroll', update);
    };
  });

  useEffect(() => {
    if (!divRef.current || !window || !socket || messages.length === 0) return;
    const { right, bottom } = divRef.current.getBoundingClientRect();
    if (right <= window.innerWidth && bottom <= window.innerHeight) {
      socket.readMessage(messages[0].id);
    }
  }, [messages]);

  let title = '讨论';
  if (type === 'newsroom' && event) {
    if (eventOwner) {
      title += ` — @${eventOwner.username}/${event.name}`;
    } else {
      title += ` — ${event.name}`;
    }
  }

  const findBotClientId = async (): Promise<number | null> => {
    if (cachedBotClientId) return cachedBotClientId;
    try {
      const { clientList } = await RedstoneService.findClients('bot');
      const bot = clientList.find((c: any) => c.username === 'bot');
      if (bot) {
        cachedBotClientId = bot.id;
        return bot.id;
      }
    } catch (err) {
      // ignore
    }
    return null;
  };

  const handleStopAgent = () => {
    if (!eventId) return;
    setStopConfirmVisible(true);
  };

  const handleStopConfirm = async () => {
    setStopConfirmVisible(false);
    try {
      await del(`/event/${eventId}/agent`);
    } catch (err) {
      // error handled
    }
  };

  const sendMessage = async () => {
    if (!socket) return;
    if (message.trim().length === 0) return;

    // @bot permission check
    if (message.includes('@bot') && isNewsroom) {
      if (!canEdit) {
        Modal.info({
          title: '权限不足',
          content: '你需要编辑权限才能使用 Bot。请联系新闻室管理员获取编辑权限。',
        });
        setSending(false);
        return;
      }

      const botId = await findBotClientId();
      if (botId) {
        const botHasRole = roles && (
          roles.editors.includes(botId) ||
          roles.managers.includes(botId) ||
          roles.owners.includes(botId)
        );
        if (!botHasRole) {
          const confirmed = await new Promise<boolean>(resolve => {
            Modal.confirm({
              title: '授予 Bot 编辑权限',
              content: 'Bot 目前没有此新闻室的编辑权限。是否授予 Bot 编辑权限以便它可以更新时间线？',
              okText: '授权',
              cancelText: '取消',
              onOk: () => resolve(true),
              onCancel: () => resolve(false),
            });
          });
          if (confirmed) {
            try {
              const newsroomSocket = getNewsroomSocket(eventId, store);
              if (newsroomSocket) {
                await newsroomSocket.inviteEditor(botId);
              }
            } catch (err) {
              // ignore
            }
          } else {
            return;
          }
        }
      }
    }

    try {
      setSending(true);
      await socket.sendMessage(message.trim());
      setMessage('');
    } catch (err) {
      // Do nothing
    } finally {
      setSending(false);
    }
  };

  const renderTimelineItem = (item: TimelineItem) => {
    switch (item.kind) {
      case 'message':
        return <ChatroomMessage key={item.message.id} message={item.message} />;
      case 'status':
        return (
          <AgentStatusItem
            key={`status-${item.index}`}
            entry={item.entry}
            isLatest={item.isLatest}
            isActive={item.isActive}
          />
        );
      case 'thinking':
        return (
          <AgentThinkingItem
            key={`thinking-${item.index}`}
            entry={item.entry}
            isLastThinking={item.isLastThinking}
            isActive={item.isActive}
          />
        );
      case 'agent-header':
        return (
          <AgentActiveHeader
            key="agent-header"
            canEdit={item.canEdit}
            onStop={handleStopAgent}
          />
        );
      case 'agent-summary':
        return (
          <AgentRunSummary
            key="agent-summary"
            agentRun={item.agentRun}
            onExpand={handleExpandAgentHistory}
          />
        );
      case 'agent-collapse':
        return (
          <AgentRunCollapseToggle
            key="agent-collapse"
            agentRun={item.agentRun}
            onCollapse={() => setAgentHistoryExpanded(false)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="header">
        <Typography.Text ellipsis style={{ margin: 0, minWidth: 0, flex: 1 }}>
          <MessageTwoTone /> {title}
        </Typography.Text>
        <div className="header-actions">
          <Button
            type="text"
            icon={expanded ? <CompressOutlined /> : <ExpandOutlined />}
            onClick={() => {
              const next = !expanded;
              setExpanded(next);
              localStorage.setItem(`chatroom:expanded:${chatId}`, next ? '1' : '0');
            }}
            size="small"
          />
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} size="small" />
        </div>
      </div>
      <div className="messages" ref={divRef}>
        {displayItems.map(renderTimelineItem)}
        {displayItems.length === 0 && (
          <div className="empty">
            <Empty description="在这里讨论如何编辑这条时间线吧" />
          </div>
        )}
        {displayItems.length > 0 && <p className="blank">.</p>}
      </div>
      <Input.Group compact>
        <Input
          style={{
            width: 'calc(100% - 2rem + 1px)',
            borderRadius: 0,
          }}
          defaultValue={message}
          value={message}
          onChange={val => setMessage(val.target.value)}
          onPressEnter={sendMessage}
          placeholder="请输入……"
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          style={{
            width: '2rem',
            borderRadius: 0,
          }}
          loading={sending}
          onClick={sendMessage}
        />
      </Input.Group>
      <Modal
        title="停止 Bot"
        visible={stopConfirmVisible}
        onOk={handleStopConfirm}
        onCancel={() => setStopConfirmVisible(false)}
        okText="停止"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        getContainer={false}
      >
        <p>确定要停止 Bot 吗？Bot 将停止当前正在执行的任务。</p>
      </Modal>
      <style jsx>
        {`
          .container {
            display: flex;
            flex-direction: column;
            background-color: #ffffff;
            border-radius: 0.5rem;
            width: ${expanded ? '36rem' : '18rem'};
            max-width: calc(100vw - 2rem);
            box-shadow: 0 4px 4px rgba(0, 0, 0, 0.01);
            transition: width 0.2s ease, max-width 0.2s ease;
          }

          .header {
            height: 2.25rem;
            border: 1px solid #d9d9d9;
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
            display: flex;
            align-items: center;
            padding: 0 0.25rem 0 0.5rem;
            background-color: rgba(0, 0, 0, 0.01);
            overflow: hidden;
          }

          .header-actions {
            display: flex;
            flex-shrink: 0;
            align-items: center;
            margin-left: 0.25rem;
          }

          .messages {
            width: 100%;
            height: ${expanded ? 'calc(80vh - 8rem)' : '20rem'};
            overflow: auto;
            display: flex;
            flex-direction: column-reverse;
            border-left: 1px solid #d9d9d9;
            border-right: 1px solid #d9d9d9;
            transition: height 0.2s ease;
          }

          .empty {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .blank {
            height: 0.25rem;
            visibility: hidden;
          }

          @media (max-width: 500px) {
            .container {
              width: ${expanded ? '100vw' : '100vw'};
              max-width: 100vw;
            }

            .messages {
              height: ${expanded ? 'calc(100vh - 8rem)' : '20rem'};
            }
          }
        `}
      </style>
    </div>
  );
};

export default ChatroomWindow;
