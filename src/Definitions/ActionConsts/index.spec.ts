import { ActionConsts } from '.';

describe('Action constants', () => {
  describe('App', () => {
    it('should have App_SetReducer', () => {
      expect(ActionConsts.App.SetReducer).toBe('App_SetReducer');
    });

    it('should have App_ResetReducer', () => {
      expect(ActionConsts.App.ResetReducer).toBe('App_ResetReducer');
    });
  });
});
