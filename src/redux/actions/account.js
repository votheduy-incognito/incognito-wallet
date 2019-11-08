import type from '@src/redux/types/account';
import walletType from '@src/redux/types/wallet';
import accountService from '@src/services/wallet/accountService';
import { getPassphrase } from '@src/services/wallet/passwordService';
import { tokenSeleclor, accountSeleclor } from '../selectors';
import { getBalance as getTokenBalance, setListToken } from './token';

/**
 *  return basic account object from its name like its KEY, not including account methods (please use accountWallet instead) 
 *
 * @param {object} state redux state
 * @param {string} accountName name of account you wanna get
 */
const getBasicAccountObjectByName = state => accountName => {
  return accountSeleclor.getAccountByName(state)(accountName);
};

export const setAccount = (account = throw new Error('Account object is required')) => ({
  type: type.SET,
  data: account
});

export const setListAccount = (accounts = throw new Error('Account array is required')) => {
  if (accounts && accounts.constructor !== Array) {
    throw new TypeError('Accounts must be an array');
  }

  return ({
    type: type.SET_LIST,
    data: accounts
  });
};

export const removeAccount = (account = throw new Error('Account is required')) => async (dispatch, getState) => {
  try {
    const wallet = getState()?.wallet;

    if (!wallet) {
      throw new Error('Wallet is not existed, can not remove account right now');
    }

    const { PrivateKey, name, }  = account;
    const passphrase = await getPassphrase();
    await accountService.removeAccount(
      PrivateKey,
      passphrase,
      wallet
    );

    dispatch({
      type: type.REMOVE_BY_NAME,
      data: name
    });

    return true;
  } catch (e) {
    throw e;
  }
};

export const getBalanceStart = accountName => ({
  type: type.GET_BALANCE,
  data: accountName
});

export const getBalanceFinish = accountName => ({
  type: type.GET_BALANCE_FINISH,
  data: accountName
});

export const setDefaultAccount = account => {
  accountService.saveDefaultAccountToStorage(account?.name);
  return ({
    type: type.SET_DEFAULT_ACCOUNT,
    data: account
  });
};

export const getBalance = (account) => async (dispatch, getState) => {
  let balance = 0;
  try {
    if (!account) throw new Error('Account object is required');

    dispatch(getBalanceStart(account?.name));

    const wallet = getState()?.wallet;

    if (!wallet) {
      throw new Error('Wallet is not exist');
    }

    balance = await accountService.getBalance(account, wallet);
    dispatch(setAccount({
      ...account,
      value: balance
    }));
    
  } catch (e) {
    account && dispatch(setAccount({
      ...account,
      value: null
    }));
    throw e;
  } finally {
    dispatch(getBalanceFinish(account?.name));
  }

  return balance??0;
};


export const reloadAccountFollowingToken = (account = throw new Error('Account object is required')) => async (dispatch, getState) => {
  try {
    const wallet = getState()?.wallet;

    if (!wallet) {
      throw new Error('Wallet is not exist');
    }

    const tokens = accountService.getFollowingTokens(account, wallet);

    tokens.forEach(token => getTokenBalance(token)(dispatch, getState));

    dispatch(setListToken(tokens));

    return tokens;
  } catch (e) {
    throw e;
  }
};

export const followDefaultTokens = (account = throw new Error('Account object is required'), pTokenList) => async (dispatch, getState) => {
  try {
    const state = getState();
    const wallet = state?.wallet;
    const pTokens = pTokenList || tokenSeleclor.pTokens(state);  

    if (!wallet) {
      throw new Error('Wallet is not exist');
    }

    const defaultTokens = [];
    pTokens?.forEach((token) => {
      if (token.default) {
        defaultTokens.push(token.convertToToken());
      }
    });

    if (defaultTokens?.length > 0) {
      await accountService.addFollowingTokens(defaultTokens, account, wallet);
    }
    
    // update wallet object to store
    dispatch({
      type: walletType.SET,
      data: wallet
    });

    return defaultTokens;
  } catch (e) {
    throw e;
  }
};

export const switchAccount = (accountName) => async (dispatch, getState) => {
  try {
    if (!accountName) throw new Error('accountName is required');

    const state = getState();
    const wallet = state?.wallet;

    if (!wallet) {
      throw new Error('Wallet is not exist');
    }

    const account = getBasicAccountObjectByName(state)(accountName);
    const defaultAccount = accountSeleclor.defaultAccount(state);

    if (defaultAccount?.name === account?.name) {
      return;
    }

    dispatch(setDefaultAccount(account));
    await getBalance(account)(dispatch, getState).catch(() => null);
    await reloadAccountFollowingToken(account)(dispatch, getState).catch(() => null);

    return accountSeleclor.defaultAccount(state);
  } catch (e) {
    throw e;
  }
};