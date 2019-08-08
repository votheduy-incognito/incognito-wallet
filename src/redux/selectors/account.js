import { createSelector } from 'reselect';
import { memoize } from 'lodash';

export const isGettingBalance = state => state?.account?.isGettingBalance;
export const defaultAccountName = state => state?.account?.defaultAccountName;
export const listAccount = state => state?.account?.list;
export const defaultAccount = createSelector(
  listAccount,
  defaultAccountName,
  (list, defaultName) => {
    return list?.find(account => account?.name === defaultName);
  }
);
export const getAccountByName = createSelector(
  listAccount,
  accounts => memoize(accountName => accounts.find(account => account?.name === accountName))
);

export default {
  defaultAccountName,
  listAccount,
  defaultAccount,
  isGettingBalance,
  getAccountByName
};