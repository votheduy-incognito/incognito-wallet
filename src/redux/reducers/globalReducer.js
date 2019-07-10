import { CONSTANT_APP } from '@src/constants';

const reducer = (state, action) => {
  if (/ACCOUNT\//.test(action.type) || /WALLET\//.test(action.type)) {
    const isReady = state?.account?.defaultAccount?.value !== null && !!state?.wallet?.Name;
    const appState = state?.app;
    return {
      ...state,
      app: {
        ...appState,
        status: isReady ? CONSTANT_APP.STATUS.READY : appState?.status,
        isReady,
      }
    };
  }

  return state;
};

export default reducer;