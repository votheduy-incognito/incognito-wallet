import { batch } from 'react-redux';
import { loadListAccount } from '@src/services/wallet/WalletService';
import accountService from '@src/services/wallet/accountService';
import type from '@src/redux/types/wallet';
// eslint-disable-next-line import/no-cycle
import {
  setListAccount,
  setDefaultAccount, actionReloadFollowingToken, getBalance, getBalanceStart, setAccount,
} from '@src/redux/actions/account';
import { accountSeleclor } from '@src/redux/selectors';
import { currentMasterKeySelector } from '@src/redux/selectors/masterKey';
import { walletSelector } from '@src/redux/selectors/wallet';
// eslint-disable-next-line import/no-cycle
import { updateMasterKey } from '@src/redux/actions/masterKey';
// eslint-disable-next-line import/no-cycle
import { getBalance as getTokenBalance, setListToken } from '@src/redux/actions/token';

const getStoredDefaultAccountName = async (listAccount) => {
  const firstAccountName = listAccount && listAccount[0]?.name;
  try {
    const storedName = await accountService.getDefaultAccountName();
    if (storedName) {
      const account = listAccount.find(item => item.name === storedName);

      if (account) {
        return storedName;
      }
    }
    throw new Error(
      'Can not find stored account name, will fallback to first account',
    );
  } catch {
    return firstAccountName;
  }
};

export const setWallet = (
  wallet = throw new Error('Wallet object is required'),
) => ({
  type: type.SET,
  data: wallet,
});

export const removeWallet = () => ({
  type: type.REMOVE,
});

export const reloadAccountList = () => async (dispatch, getState) => {
  const state = getState();
  const wallet = walletSelector(state);
  const masterKey = currentMasterKeySelector(state);
  if (!wallet) {
    return;
  }
  const accounts = await loadListAccount(wallet);
  await dispatch(updateMasterKey(masterKey));
  await dispatch(setListAccount(accounts));
  return accounts;
};

export const reloadWallet = (accountName) => async (dispatch, getState) => {
  try {
    const state = getState();
    const masterKey = currentMasterKeySelector(state);
    const wallet = masterKey.wallet;

    let defaultAccount = accountSeleclor.defaultAccount(state);

    if (wallet) {
      const accounts = await loadListAccount(wallet);
      if (!accountName) {
        // Change default account to first account after switching master key
        if (defaultAccount) {
          const existed = accounts.find(item => item.PrivateKey === defaultAccount.PrivateKey);
          if (!existed) {
            defaultAccount = accounts[0];
          }
        }

        if (!defaultAccount) {
          const defaultAccountName = await getStoredDefaultAccountName(accounts);
          defaultAccount = accounts?.find((a) => a?.name === defaultAccountName);
        }

        batch(() => {
          dispatch(setWallet(wallet));
          dispatch(setListAccount(accounts));
          defaultAccount && dispatch(setDefaultAccount(defaultAccount));
        });
      } else {
        const account = accounts.find(item => accountService.getAccountName(item) === accountName);
        const followed = await accountService.getFollowingTokens(account, wallet);

        followed.forEach(item => {
          item.loading = true;
        });

        batch(() => {
          dispatch(setWallet(wallet));
          dispatch(setListAccount(accounts));
          dispatch(setDefaultAccount(account));
          dispatch(setAccount(account));
          dispatch(getBalanceStart(account?.name));
          dispatch(setListToken(followed));
        });

        setTimeout(() => {
          dispatch(actionReloadFollowingToken(true));
        }, 1000);
      }

      return wallet;
    }
    return false;
  } catch (e) {
    throw e;
  }
};
