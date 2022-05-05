export const getChatId = (type: 'client' | 'newsroom', ids: number | number[]) =>
  type === 'client'
    ? `chat-clients:${(ids as number[]).sort().join('-')}`
    : `chat-newsroom:${ids as number}`;
