import { createSelector } from 'reselect';
import { memoize } from 'lodash';

export const isGettingBalance = state => state?.account?.isGettingBalance;
export const defaultAccountName = state => state?.account?.defaultAccountName;
export const listAccount = state => state?.account?.list;
export const defaultAccount = createSelector(
  listAccount,
  defaultAccountName,
  (list, defaultName) => {
    let account = list?.find(account => account?.name === defaultName);
    if (!account?.name) {
      console.warn(`Can not get account ${account?.name}, fallback to first account (default account)`);
      account = list && list[0]; 
    }

    return account;
  }
);
export const getAccountByName = createSelector(
  listAccount,
  accounts => memoize(accountName => accounts.find(account => account?.name === accountName))
);

export const getAccountByPublicKey = createSelector(
  listAccount,
  accounts => memoize(publicKey => accounts.find(account => account?.PublicKeyCheckEncode === publicKey))
);

export const getAccountByBlsKey =  createSelector(
  listAccount,
  accounts => memoize(blsKey => accounts.find(account => account?.BlockProducerKey === blsKey))
);

export default {
  defaultAccountName,
  listAccount,
  defaultAccount,
  isGettingBalance,
  getAccountByName,
  getAccountByPublicKey,
  getAccountByBlsKey
};