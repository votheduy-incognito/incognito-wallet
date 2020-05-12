import { createSelector } from 'reselect';
import { CONSTANT_COMMONS } from '@src/constants';
import { isGettingBalance as isGettingBalanceToken } from './token';
import { isGettingBalance as isGettingBalanceAccount, defaultAccountName } from './account';

export const isGettingBalance = createSelector(
  isGettingBalanceToken,
  isGettingBalanceAccount,
  defaultAccountName,
  (tokens, accounts, defaultAccountName) => {
    return [
      ...accounts?.includes(defaultAccountName) ? [CONSTANT_COMMONS.PRV_TOKEN_ID] : [],
      ...tokens
    ];
  }
);

export default {
  isGettingBalance
};