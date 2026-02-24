import rfdc from 'rfdc';
import { NewsroomsState, NewsroomAction } from '@Interfaces';

const clone = rfdc();

const finishAgentThinking = (state: NewsroomsState, action: NewsroomAction) => {
  if (!action.eventId || !action.runId) return state;
  const eventId = -Math.abs(action.eventId);
  const index = state.idIndexMap[eventId];
  if (typeof index === 'undefined') return state;
  const newsroom = clone(state.list[index]);

  if (!newsroom.agentRun || newsroom.agentRun.runId !== action.runId) return state;

  const lastBlock = newsroom.agentRun.thinkingBlocks[newsroom.agentRun.thinkingBlocks.length - 1];
  if (lastBlock) {
    lastBlock.done = true;
  }

  return {
    ...state,
    list: [...state.list.slice(0, index), newsroom, ...state.list.slice(index + 1)],
  };
};

export default finishAgentThinking;
