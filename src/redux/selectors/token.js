import memoize from 'memoize-one';
import { CONSTANT_CONFIGS, CONSTANT_COMMONS } from '@src/constants';
import { createSelector } from 'reselect';

export const followed = state => state?.token?.followed;
export const isGettingBalance = state => state?.token?.isGettingBalance;
export const pTokens = state => state?.token?.pTokens;
export const internalTokens = state => state?.token?.internalTokens;

export default {
  followed,
  isGettingBalance,
  pTokens,
  internalTokens,
};