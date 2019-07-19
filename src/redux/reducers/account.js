import type from '@src/redux/types/account';
import _ from 'lodash';

const initialState = {
  list: [],
  defaultAccountName: '',
  isGettingBalance: []
};

const setAccount = (list, account) => {
  let newList = [...list];
  try {
    newList = _.unionBy([account], list, 'name');
  } catch(e) {
    console.error(e);
  }
  return newList;
};

const setBulkAccount = (list, accounts) => {
  let newList = [...list];
  try {
    newList = _.unionBy(accounts, list, 'name');
  } catch(e) {
    console.error(e);
  }
  return newList;
};

const removeByName = (list, accountName) => {
  const newList = [...list];
  try {
    _.remove(newList, _item => _item.name === accountName);
  } catch(e) {
    console.error(e);
  }
  return newList;
};

const setGettingBalance = (list, accountName) => {
  const newList = [...list];
  return newList.includes(accountName) ? newList : [...newList, accountName];
};

const removeGettingBalance = (list, accountName) => {
  const newList = [...list];
  _.remove(newList, item => item === accountName);
  return newList;
};

const reducer = (state = initialState, action) => {
  let newList = [];

  switch (action.type) {
  case type.SET:
    newList = setAccount(state.list, action.data);
    return {
      ...state,
      list: newList,
    };
  case type.SET_BULK:
    newList = setBulkAccount(state.list, action.data);
    return {
      ...state,
      list: newList,
    };
  case type.REMOVE_BY_NAME:
    newList = removeByName(state.list, action.data);
    return {
      ...state,
      list: newList,
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
  case type.SET_DEFAULT_ACCOUNT:
    return {
      ...state,
      defaultAccountName: action.data?.name,
    };
  default:
    return state;
  }
};

export default reducer;