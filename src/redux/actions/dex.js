import LocalDatabase from '@utils/LocalDatabase';
import types from '@src/redux/types/dex';
import { getPDETradeStatus, getTransactionByHash } from '@services/wallet/RpcClientService';
import { MESSAGES } from '@screens/Dex/constants';
import {DepositHistory, TradeHistory, WithdrawHistory} from '@models/dexHistory';

export const TRANSFER_STATUS = {
  PROCESSING: 'processing',
  PENDING: 'pending',
  SUCCESSFUL: 'successful',
  UNSUCCESSFUL: 'unsuccessful',
  INTERRUPTED: 'tap to try again',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const TRADE_STATUS = [
  TRANSFER_STATUS.PENDING,
  TRANSFER_STATUS.SUCCESSFUL,
  TRANSFER_STATUS.REFUNDED,
];

export const NOT_CHANGE_STATUS = [
  TRANSFER_STATUS.SUCCESSFUL,
  TRANSFER_STATUS.REFUNDED,
  TRANSFER_STATUS.UNSUCCESSFUL,
  TRANSFER_STATUS.INTERRUPTED
];

export const MAX_ERROR_TRIED = 10;

const HISTORY_TYPES = {
  [MESSAGES.TRADE]: TradeHistory,
  [MESSAGES.DEPOSIT]: DepositHistory,
  [MESSAGES.WITHDRAW]: WithdrawHistory,
};

function getDepositStatus(history) {
  return getTransactionByHash(history.txId)
    .then(result => {
      if (result.isInBlock) {
        return TRANSFER_STATUS.SUCCESSFUL;
      } else if (result.isInMempool) {
        return TRANSFER_STATUS.PENDING;
      } else if (result.err) {
        return TRANSFER_STATUS.UNSUCCESSFUL;
      }
    })
    .catch((error) => error.message);
}

function getWithdrawStatus(history) {
  return getTransactionByHash(history.txId)
    .then(async result => {
      if (WithdrawHistory.currentWithdraw && history.txId === WithdrawHistory.currentWithdraw.txId) {
        return TRANSFER_STATUS.PROCESSING;
      }

      if (!history.txId2 && (result.isInBlock || result.isInMempool)) {
        return TRANSFER_STATUS.INTERRUPTED;
      }

      if (history.txId2) {
        result = await getTransactionByHash(history.txId2);
      }

      if (result.isInBlock) {
        return TRANSFER_STATUS.SUCCESSFUL;
      } else if (result.isInMempool) {
        return TRANSFER_STATUS.PENDING;
      } else if (result.err) {

        if (history.txId2) {
          return TRANSFER_STATUS.INTERRUPTED;
        }

        return TRANSFER_STATUS.UNSUCCESSFUL;
      }
    })
    .catch((error) => error.message);
}

function getTradeStatus(history) {
  return getTransactionByHash(history.txId)
    .then(async result => {
      if (result.isInMempool) {
        return TRANSFER_STATUS.PENDING;
      } else if (result.err) {
        return TRANSFER_STATUS.UNSUCCESSFUL;
      }
    })
    .then(() => getPDETradeStatus(history.txId))
    .then(result => TRADE_STATUS[result.state])
    .catch((error) => error.message);
}

async function getStatus(history) {
  if (history.type === MESSAGES.TRADE) {
    return getTradeStatus(history);
  } else if (history.type === MESSAGES.WITHDRAW) {
    return getWithdrawStatus(history);
  } else {
    return getDepositStatus(history);
  }

}

export const getHistoriesSuccess = (histories) => ({
  type: types.GET_HISTORIES,
  payload: histories,
});

export const getHistories = () => async (dispatch) => {
  const histories = await LocalDatabase.getDexHistory();
  const formattedHistories = histories.map(item => {
    const history = HISTORY_TYPES[item.type].load(item);

    if (history.status === TRANSFER_STATUS.UNSUCCESSFUL && history.errorTried < MAX_ERROR_TRIED) {
      history.status = undefined;
    } else {
      history.status = NOT_CHANGE_STATUS.includes(item.status) ? item.status : undefined;
    }

    history.errorTried = history.errorTried || 0;

    return history;
  });

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
  if (status === TRANSFER_STATUS.UNSUCCESSFUL) {
    history.errorTried = history.errorTried > 0 ? ++history.errorTried : 1;
  }

  history.updatedAt = Math.floor(new Date().getTime() / 1000);
  dispatch(getHistoryStatusSuccess(history));
};

export const addHistorySuccess = (history) => ({
  type: types.ADD_HISTORY,
  payload: history,
});

export const addHistory = (history) => async (dispatch) => {
  dispatch(addHistorySuccess(history));
};

export const updateHistorySuccess = (history) => ({
  type: types.UPDATE_HISTORY,
  payload: history,
});

export const updateHistory = (history) => async (dispatch) => {
  dispatch(updateHistorySuccess(history));
};
