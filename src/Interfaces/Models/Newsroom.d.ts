type StringDict = { [index: string]: number[] };

export interface NewsroomRoles extends StringDict {
  owners: number[];
  managers: number[];
  editors: number[];
  viewers: number[];
}

export type NewsroomSocketStatus = 'connected' | 'disconnected' | 'connecting';

export interface AgentStatusEntry {
  status: string;
  timestamp: string;
}

export interface ThinkingEntry {
  text: string;
  done: boolean;
  timestamp: string;
}

export type AgentTimelineEntry =
  | { type: 'thinking'; index: number }
  | { type: 'status'; index: number };

export interface AgentRunState {
  runId: string;
  statuses: AgentStatusEntry[];
  thinkingBlocks: ThinkingEntry[];
  timeline: AgentTimelineEntry[];
  isActive: boolean;
}

export interface Newsroom {
  eventId: number;
  clients: number[];
  roles: NewsroomRoles;
  resourceLocks: { [index: string]: number };
  socketStatus: NewsroomSocketStatus;
  agentStatus: string | null;
  agentRun: AgentRunState | null;
}
