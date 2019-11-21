import types from '@src/redux/types/dex';
import LocalDatabase from '@src/utils/LocalDatabase';

const initialState = {
  histories: [],
};

function updateHistory(history, histories = []) {
  for (let i = 0; i < histories.length; i++) {
    if (histories[i].txId === history.txId) {
      histories[i] = history;
    }
  }

  const newHistories = [...histories];
  LocalDatabase.saveDexHistory(newHistories);
  return newHistories;
}

function addHistory(history, histories = []) {
  const newHistories = [...histories, history];
  LocalDatabase.saveDexHistory(newHistories);
  return newHistories;
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case types.GET_HISTORIES:
    return {
      ...state,
      histories: action.payload,
    };
  case types.GET_HISTORY_STATUS:
    return {
      ...state,
      histories: updateHistory(action.payload, state.histories),
    };
  case types.ADD_HISTORY:
    return {
      ...state,
      histories: addHistory(action.payload, state.histories),
    };
  case types.UPDATE_HISTORY:
    return {
      ...state,
      histories: updateHistory(action.payload, state.histories),
    };
  default:
    return state;
  }
};

export default reducer;
