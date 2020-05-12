import type from '@src/redux/types/token';
import {accountSeleclor} from '@src/redux/selectors';
import {getTokenList} from '@src/services/api/token';
import tokenService from '@src/services/wallet/tokenService';
import accountService from '@src/services/wallet/accountService';

export const setToken = (
  token = throw new Error('Token object is required'),
) => ({
  type: type.SET,
  data: token,
});

export const removeTokenById = (
  tokenId = throw new Error('Token id is required'),
) => ({
  type: type.REMOVE_BY_ID,
  data: tokenId,
});

/**
 * Replace with new list
 */
export const setListToken = (
  tokens = throw new Error('Token list is required'),
) => {
  if (tokens && tokens.constructor !== Array) {
    throw new TypeError('Tokens must be an array');
  }

  return {
    type: type.SET_LIST,
    data: tokens,
  };
};

/**
 * Replace with new list
 */
export const setListPToken = (
  tokens = throw new Error('Token list is required'),
) => {
  if (tokens && tokens.constructor !== Array) {
    throw new TypeError('Tokens must be an array');
  }

  return {
    type: type.SET_PTOKEN_LIST,
    data: tokens,
  };
};

export const setListInternalToken = (
  tokens = throw new Error('Token list is required'),
) => {
  if (tokens && tokens.constructor !== Array) {
    throw new TypeError('Tokens must be an array');
  }

  return {
    type: type.SET_INTERNAL_LIST,
    data: tokens,
  };
};

export const setBulkToken = (
  tokens = throw new Error('Token array is required'),
) => {
  if (tokens && tokens.constructor !== Array) {
    throw new TypeError('Tokens must be an array');
  }

  return {
    type: type.SET_BULK,
    data: tokens,
  };
};

export const getBalanceStart = tokenSymbol => ({
  type: type.GET_BALANCE,
  data: tokenSymbol,
});

export const getBalanceFinish = tokenSymbol => ({
  type: type.GET_BALANCE_FINISH,
  data: tokenSymbol,
});

export const getBalance = (
  token = throw new Error('Token object is required'),
) => async (dispatch, getState) => {
  try {
    dispatch(getBalanceStart(token?.id));

    const wallet = getState()?.wallet;
    const account = accountSeleclor.defaultAccount(getState());

    if (!wallet) {
      throw new Error('Wallet is not exist');
    }

    if (!account) {
      throw new Error('Account is not exist');
    }

    const balance = await accountService.getBalance(account, wallet, token.id);
    dispatch(
      setToken({
        ...token,
        amount: balance,
      }),
    );

    return balance;
  } catch (e) {
    dispatch(
      setToken({
        ...token,
        amount: null,
      }),
    );
    throw e;
  } finally {
    dispatch(getBalanceFinish(token?.id));
  }
};

export const getPTokenList = () => async dispatch => {
  try {
    const tokens = await getTokenList();

    dispatch(setListPToken(tokens));

    return tokens;
  } catch (e) {
    throw e;
  }
};

export const getInternalTokenList = () => async dispatch => {
  try {
    const tokens = await tokenService.getPrivacyTokens();

    dispatch(setListInternalToken(tokens));

    return tokens;
  } catch (e) {
    throw e;
  }
};

export const actionAddFollowTokenFail = payload => ({
  type: type.ADD_FOLLOW_TOKEN_FAIL,
  payload,
});

export const actionAddFollowTokenSuccess = payload => ({
  type: type.ADD_FOLLOW_TOKEN_SUCCESS,
  payload,
});
