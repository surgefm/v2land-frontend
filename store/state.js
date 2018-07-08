export default {
  client: {
    username: '',
    email: '',
    role: '',
    subscriptions: [],
    events: [],
  },
  fetchingStatus: {
    getEvent: {
      status: 'initial',
      isRefresh: true,
    },
    eventList: {
      status: 'initial',
      isRefresh: true,
    },
  },
  availableAuths: [],
  event: {},
  eventName: {},
  eventId: [],
  stack: {},
  news: {},
  newsId: [],
  clientList: [],
  temp: {},
  subscribe: {
    mode: '',
    contact: {
      method: '',
      address: '',
    },
  },
};
