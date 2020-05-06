export const ActionConsts = {
  App: {
    ResetReducer: 'App_ResetReducer',
    SetReducer: 'App_SetReducer',
  },
  Event: {
    AddEvent: 'Event_AddEvent',
    UpdateEvent: 'Event_UpdateEvent',
    UpdateEventStackListOrder: 'Event_UpdateEventStackListOrder',
    UpdateEventOffshelfStackListOrder: 'Event_UpdateEventOffshelfStackListOrder',
    AddStackToEvent: 'Event_AddStackToEvent',
    AddNewsToEvent: 'Event_AddNewsToEvent',
    AddNewsToEventOffshelfNewsList: 'Event_AddNewsToEventOffshelfNewsList',
  },
  Stack: {
    AddStack: 'Stack_AddStack',
    UpdateStack: 'Stack_UpdateStack',
    AddNewsToStack: 'Stack_AddNewsToStack',
  },
  News: {
    AddNews: 'News_AddNews',
    UpdateNews: 'News_UpdateNews',
  },
  Client: {
    AddClient: 'Client_AddClient',
    UpdateClient: 'Client_UpdateClient',
  },
  Loading: {
    BeginLoading: 'Loading_BeginLoading',
    FinishLoading: 'Loading_FinishLoading',
  },
};
