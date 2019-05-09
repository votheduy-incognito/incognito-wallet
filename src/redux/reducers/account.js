import type from '@src/redux/types/account';
import _ from 'lodash';

const initialState = [];

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

const reducer = (state = initialState, action) => {
  switch (action.type) {
  case type.SET:
    return setAccount(state, action.data);
  case type.SET_BULK:
    return setBulkAccount(state, action.data);
  case type.REMOVE_ALL:
    return [];
  case type.REMOVE_BY_NAME:
    return removeByName(state, action.data);
  default:
    return state;
  }
};

export default reducer;