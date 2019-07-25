import { createSelector } from 'reselect';

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

export default {
  defaultAccountName,
  listAccount,
  defaultAccount,
  isGettingBalance
};