import LocalDatabase from '@utils/LocalDatabase';
import types from '@src/redux/types/dex';
import { getPDETradeStatus } from '@services/wallet/RpcClientService';

const TRADE_STATUS = [
  'pending',
  'successful',
  'refunded',
];

const NOT_CHANGE_STATUS = [
  'successful',
  'refunded',
];

async function getStatus(history) {
  return getPDETradeStatus(history.txId)
    .then(result => TRADE_STATUS[result.state])
    .catch((error) => error.message);

}

export const getHistoriesSuccess = (histories) => ({
  type: types.GET_HISTORIES,
  payload: histories,
});

export const getHistories = () => async (dispatch) => {
  const histories = await LocalDatabase.getDexHistory();
  const formattedHistories = histories.map(item => ({
    ...item,
    status: NOT_CHANGE_STATUS.includes(item.status) ? item.status : undefined,
  }));
  dispatch(getHistoriesSuccess(formattedHistories));
  return formattedHistories;
};

export const getHistoryStatusSuccess = (history) => ({
  type: types.GET_HISTORY_STATUS,
  payload: history,
});

export const getHistoryStatus = (history) => async (dispatch) => {
  const status = await getStatus(history);
  history.status = status;
  dispatch(getHistoryStatusSuccess(history));
};

export const addHistorySuccess = (history) => ({
  type: types.ADD_HISTORY,
  payload: history,
});

export const addHistory = (history) => async (dispatch) => {
  dispatch(addHistorySuccess(history));
};
