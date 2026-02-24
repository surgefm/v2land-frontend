import rfdc from 'rfdc';
import { NewsroomsState, NewsroomAction, AgentRunState } from '@Interfaces';

const clone = rfdc();

function createAgentRun(runId: string): AgentRunState {
  return {
    runId,
    statuses: [],
    thinkingBlocks: [],
    timeline: [],
    isActive: true,
  };
}

const setAgentStatus = (state: NewsroomsState, action: NewsroomAction) => {
  if (!action.eventId) return state;
  const eventId = -Math.abs(action.eventId);
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;
  const newsroom = clone(state.list[index]);

  const status = action.agentStatus !== undefined ? action.agentStatus : null;
  const { runId, timestamp } = action;

  // Update legacy agentStatus field
  newsroom.agentStatus = status;

  if (status === null) {
    // Agent run completed — mark as inactive
    if (newsroom.agentRun) {
      newsroom.agentRun.isActive = false;
    }
  } else if (runId) {
    // Ensure agentRun exists for this runId
    if (!newsroom.agentRun || newsroom.agentRun.runId !== runId) {
      newsroom.agentRun = createAgentRun(runId);
    }

    // Append status entry
    const statusEntry = { status, timestamp: timestamp || new Date().toISOString() };
    newsroom.agentRun.statuses.push(statusEntry);
    newsroom.agentRun.timeline.push({
      type: 'status',
      index: newsroom.agentRun.statuses.length - 1,
    });
  }

  return {
    ...state,
    list: [...state.list.slice(0, index), newsroom, ...state.list.slice(index + 1)],
  };
};

export default setAgentStatus;
