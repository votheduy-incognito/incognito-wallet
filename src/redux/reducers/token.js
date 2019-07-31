import type from '@src/redux/types/token';
import { unionBy, remove } from 'lodash';

const initialState = {
  followed: [],
  pTokens: null,
  isGettingBalance: []
};

const setToken = (list, token) => {
  let newList = [...list];
  try {
    const foundIndex = list.findIndex(t => t.id === token.id);
    if (foundIndex >= 0) {
      newList[foundIndex] = token;
    }
  } catch(e) {
    throw new Error('Save token failed');
  }
  return newList;
};

const removeTokenById = (list, tokenId) => {
  let newList = [...list];
  try {
    newList = remove(newList, t => t.id === tokenId);
  } catch(e) {
    throw new Error('Remove token failed');
  }
  return newList;
};

const setBulkToken = (list, tokens) => {
  let newList = [...list];
  try {
    newList = unionBy(tokens, list, 'symbol');
  } catch(e) {
    throw new Error('Save tokens failed');
  }
  return newList;
};

const setListToken = tokens => {
  return [...tokens];
};

const setGettingBalance = (list, tokenSymbol) => {
  const newList = [...list];
  return newList.includes(tokenSymbol) ? newList : [...newList, tokenSymbol];
};

const removeGettingBalance = (list, tokenSymbol) => {
  const newList = [...list];
  remove(newList, item => item === tokenSymbol);
  return newList;
};

const reducer = (state = initialState, action) => {
  let newList = [];

  switch (action.type) {
  case type.SET:
    newList = setToken(state.followed, action.data);
    return {
      ...state,
      followed: newList,
    };
  case type.SET_BULK:
    newList = setBulkToken(state.followed, action.data);
    return {
      ...state,
      followed: newList,
    };
  case type.GET_BALANCE: 
    return {
      ...state,
      isGettingBalance: setGettingBalance(state.isGettingBalance, action.data)
    };
  case type.GET_BALANCE_FINISH: 
    return {
      ...state,
      isGettingBalance: removeGettingBalance(state.isGettingBalance, action.data)
    };
  case type.REMOVE_BY_ID:
    newList = removeTokenById(state.followed, action.data);
    return {
      ...state,
      followed: newList
    };
  case type.SET_LIST:
    newList = setListToken(action.data);
    return {
      ...state,
      followed: newList
    }; 
  case type.SET_PTOKEN_LIST:
    return {
      ...state,
      pTokens: setListToken(action.data)
    }; 
  default:
    return state;
  }
};

export default reducer;