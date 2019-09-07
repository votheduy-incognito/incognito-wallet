export const followed = state => state?.token?.followed;
export const isGettingBalance = state => state?.token?.isGettingBalance;
export const pTokens = state => state?.token?.pTokens;
export const internalTokens = state => state?.token?.internalTokens;

export default {
  followed,
  isGettingBalance,
  pTokens,
  internalTokens
};