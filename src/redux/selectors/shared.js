import { createSelector } from 'reselect';
import { isGettingBalance as isGettingBalanceToken } from './token';
import { isGettingBalance as isGettingBalanceAccount } from './account';

export const isGettingBalance = createSelector(
  isGettingBalanceToken,
  isGettingBalanceAccount,
  (accounts, tokens) => [...accounts, ...tokens]
);

export default {
  isGettingBalance
};