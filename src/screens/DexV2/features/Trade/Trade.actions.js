import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_INPUT_TOKEN,
  ACTION_SET_OUTPUT_TOKEN,
  ACTION_SET_OUTPUT_LIST,
  ACTION_SET_FEE,
  ACTION_SET_FEE_TOKEN,
  ACTION_SET_INPUT_BALANCE,
  ACTION_SET_PRV_BALANCE,
  ACTION_SET_LAST_INPUT_TOKEN,
  ACTION_SET_LAST_ACCOUNT,
  ACTION_SET_PAIR,
  ACTION_SET_OUTPUT_VALUE,
  ACTION_SET_OUTPUT_TEXT,
  ACTION_SET_MINIMUM_AMOUNT,
  ACTION_GETTING_QUOTE,
  ACTION_SET_QUOTE,
  ACTION_SET_INPUT_VALUE,
  ACTION_SET_INPUT_TEXT,
  ACTION_SET_ERROR,
  ACTION_SET_WARNING,
  ACTION_FREE_TRADE_DATA,
} from './Trade.constant';
import { api } from './Trade.services';

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = (payload) => ({
  type: ACTION_FETCHED,
  payload,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionFetch = () => async (dispatch, getState) => {
  try {
    await dispatch(actionFetching());
    const { data } = await api();
    await dispatch(actionFetched(data));
  } catch (error) {
    await dispatch(actionFetchFail());
  }
};

export const actionSetInputToken = (payload) => ({
  type: ACTION_SET_INPUT_TOKEN,
  payload,
});

export const actionSetOutputToken = (payload) => ({
  type: ACTION_SET_OUTPUT_TOKEN,
  payload,
});

export const actionSetOutputList = (payload) => ({
  type: ACTION_SET_OUTPUT_LIST,
  payload,
});

export const actionSetFee = (payload) => ({
  type: ACTION_SET_FEE,
  payload,
});

export const actionSetFeeToken = (payload) => ({
  type: ACTION_SET_FEE_TOKEN,
  payload,
});

export const actionSetInputBalance = (payload) => ({
  type: ACTION_SET_INPUT_BALANCE,
  payload,
});

export const actionSetPRVBalance = (payload) => ({
  type: ACTION_SET_PRV_BALANCE,
  payload,
});

export const actionSetLastInputToken = (payload) => ({
  type: ACTION_SET_LAST_INPUT_TOKEN,
  payload,
});

export const actionSetLastAccount = (payload) => ({
  type: ACTION_SET_LAST_ACCOUNT,
  payload,
});

export const actionSetPair = (payload) => ({
  type: ACTION_SET_PAIR,
  payload,
});

export const actionSetOutputValue = (payload) => ({
  type: ACTION_SET_OUTPUT_VALUE,
  payload,
});

export const actionSetOutputText = (payload) => ({
  type: ACTION_SET_OUTPUT_TEXT,
  payload,
});

export const actionSetMinimumAmount = (payload) => ({
  type: ACTION_SET_MINIMUM_AMOUNT,
  payload,
});

export const actionGettingQuote = (payload) => ({
  type: ACTION_GETTING_QUOTE,
  payload,
});

export const actionsetQuote = (payload) => ({
  type: ACTION_SET_QUOTE,
  payload,
});

export const actionSetInputValue = (payload) => ({
  type: ACTION_SET_INPUT_VALUE,
  payload,
});

export const actionSetInputText = (payload) => ({
  type: ACTION_SET_INPUT_TEXT,
  payload,
});

export const actionSetError = (payload) => ({
  type: ACTION_SET_ERROR,
  payload,
});

export const actionSetWarning = (payload) => ({
  type: ACTION_SET_WARNING,
  payload,
});

export const actionFreeTradeData = () => ({
  type: ACTION_FREE_TRADE_DATA,
});
