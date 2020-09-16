import { CONSTANT_COMMONS } from '@src/constants';
import tokenService from '@src/services/wallet/tokenService';
import { getpTokenHistory } from '@src/services/api/history';
import { accountSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import { loadHistoryByAccount } from '@src/services/wallet/WalletService';
import { getFeeFromTxHistory } from '@src/screens/Wallet/features/TxHistoryDetail/TxHistoryDetail.utils';

const normalizeHistoriesFromApi = ({
  historiesFromApi = [],
  externalSymbol,
  symbol,
  decimals,
  pDecimals,
}) =>
  (historiesFromApi &&
    historiesFromApi.map((h) => ({
      ...h,
      time: h?.updatedAt,
      type: h?.addressType,
      toAddress: h?.userPaymentAddress,
      fromAddress: h?.userPaymentAddress,
      amount: h?.incognitoAmount,
      symbol: externalSymbol || symbol,
      decimals,
      pDecimals,
      status: h?.statusText,
      statusCode: h?.status,
      depositAddress: h?.depositTmpAddress,
    }))) ||
  [];

const isDecentralizedTx = (history) => {
  let isDecentralized = false;
  if (
    !!history?.metaDataType &&
    (history?.metaDataType === 27 || history?.metaDataType === 240)
  ) {
    isDecentralized = true;
  }
  return isDecentralized;
};

const normalizedHistories = ({
  histories = [],
  historiesNormalizedFromApi = [],
  externalSymbol,
  symbol,
  pDecimals,
  decimals,
}) => {
  let _histories = [];
  let _historiesFromApi = [...historiesNormalizedFromApi];
  histories &&
    histories.map((h) => {
      let history = {
        id: h?.txID,
        incognitoTxID: h?.txID,
        time: h?.time,
        type: h?.isIn
          ? CONSTANT_COMMONS.HISTORY.TYPE.RECEIVE
          : CONSTANT_COMMONS.HISTORY.TYPE.SEND,
        toAddress: h?.receivers?.length && h?.receivers[0],
        amount: h?.amountPToken,
        symbol: externalSymbol || symbol || h?.tokenSymbol,
        decimals,
        pDecimals,
        status: h?.status,
        fee: h?.feeNativeToken,
        feePToken: h?.feePToken,
        isIncognitoTx: true,
        metaDataType: h?.metaData?.Type,
      };
      if (!h?.isIn) {
        //not incognito tx
        const { indexTx, historyFromApi } = normalizedHistory(
          _historiesFromApi,
          history,
        );
        if (indexTx > -1 && !!historyFromApi) {
          _historiesFromApi[indexTx] = { ...historyFromApi };
          return null;
        }
      }
      _histories.push(history);
      return history;
    });
  return [..._historiesFromApi, ..._histories];
};

const normalizedHistory = (histories = [], history = {}) => {
  const isDecentralized = isDecentralizedTx(history);
  let indexTx = histories.findIndex(
    (item) => item?.incognitoTxID === history?.incognitoTxID,
  );
  const { fee, isUseTokenFee } = getFeeFromTxHistory(history);
  let historyFromApi;
  if (indexTx === -1) {
    return {
      indexTx,
      historyFromApi,
    };
  }
  if (!isDecentralized) {
    historyFromApi = histories[indexTx];
    let amount;
    if (
      !historyFromApi?.amount ||
      history?.status === CONSTANT_COMMONS.HISTORY.STATUS_CODE.PENDING
    ) {
      amount = isUseTokenFee
        ? history?.amount - fee - historyFromApi?.tokenFee
        : history?.amount;
    } else {
      amount = isUseTokenFee
        ? historyFromApi?.amount - fee
        : historyFromApi?.amount;
    }
    historyFromApi = {
      ...historyFromApi,
      amount: Math.max(amount, 0),
    };
  } else {
    historyFromApi = histories[indexTx];
    historyFromApi = {
      ...historyFromApi,
      burnTokenFee: isUseTokenFee ? fee : 0,
      burnPrivacyFee: isUseTokenFee ? 0 : fee,
    };
  }
  return {
    indexTx,
    historyFromApi,
  };
};

export const combineHistory = (payload) => {
  let histories = [];
  try {
    const historiesNormalizedFromApi = normalizeHistoriesFromApi(payload);
    const _histories = normalizedHistories({
      ...payload,
      historiesNormalizedFromApi,
    });
    histories = _histories.sort((a, b) =>
      new Date(a.time).getTime() < new Date(b.time).getTime() ? 1 : -1,
    );
  } catch (error) {
    console.debug(error);
  }
  return histories;
};

export const normalizeData = (histories = [], decimals, pDecimals) =>
  histories &&
  histories.map((h) => ({
    id: h?.txID,
    incognitoTxID: h?.txID,
    time: h?.time,
    type: h?.isIn
      ? CONSTANT_COMMONS.HISTORY.TYPE.RECEIVE
      : CONSTANT_COMMONS.HISTORY.TYPE.SEND,
    toAddress: h?.receivers?.length && h?.receivers[0],
    amount: h?.amountNativeToken,
    symbol: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
    status: h?.status,
    fee: h?.feeNativeToken,
    decimals,
    pDecimals,
    metaDataType: h?.metaData?.Type,
    isIncognitoTx: true,
  }));

export const loadTokenHistory = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const wallet = state?.wallet;
    const account = accountSeleclor.defaultAccount(state);
    const token = selectedPrivacySeleclor.selectedPrivacyByFollowedSelector(
      state,
    );
    if (!wallet) {
      throw new Error('Wallet is not exist to load history');
    }
    if (!account) {
      throw new Error('Account is not exist to load history');
    }
    const histories = await tokenService.getTokenHistory({
      wallet,
      account,
      token,
    });
    return histories;
  } catch (e) {
    throw e;
  }
};

export const getHistoryFromApi = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const selectedPrivacy = selectedPrivacySeleclor.selectedPrivacy(state);
    const { isDeposable, isWithdrawable, paymentAddress } = selectedPrivacy;
    if (!isWithdrawable || !isDeposable) {
      return;
    }
    return await getpTokenHistory({
      paymentAddress,
      tokenId: selectedPrivacy?.tokenId,
    });
  } catch (e) {
    throw e;
  }
};

export const loadAccountHistory = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const wallet = state?.wallet;
    const accountName = accountSeleclor.defaultAccountNameSelector(state);
    if (!wallet) {
      throw new Error('Wallet is not exist to load history');
    }
    if (!accountName) {
      throw new Error('Account is not exist to load history');
    }
    const histories = await loadHistoryByAccount(wallet, accountName);
    return histories;
  } catch (e) {
    throw e;
  }
};
