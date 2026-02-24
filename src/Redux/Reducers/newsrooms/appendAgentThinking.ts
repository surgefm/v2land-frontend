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

const appendAgentThinking = (state: NewsroomsState, action: NewsroomAction) => {
  if (!action.eventId || !action.runId || !action.thinkingChunk) return state;
  const eventId = -Math.abs(action.eventId);
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;
  const newsroom = clone(state.list[index]);

  // Ensure agentRun exists
  if (!newsroom.agentRun || newsroom.agentRun.runId !== action.runId) {
    newsroom.agentRun = createAgentRun(action.runId);
  }

  const run = newsroom.agentRun;
  const lastBlock = run.thinkingBlocks[run.thinkingBlocks.length - 1];

  if (!lastBlock || lastBlock.done) {
    // Create a new thinking block
    run.thinkingBlocks.push({ text: action.thinkingChunk, done: false, timestamp: new Date().toISOString() });
    run.timeline.push({ type: 'thinking', index: run.thinkingBlocks.length - 1 });
  } else {
    // Append to existing block
    lastBlock.text += action.thinkingChunk;
  }

  return {
    ...state,
    list: [...state.list.slice(0, index), newsroom, ...state.list.slice(index + 1)],
  };
};

export default appendAgentThinking;
