export const followed = state => state?.token?.followed;
export const isGettingBalance = state => state?.token?.isGettingBalance;
export const pTokens = state => state?.token?.pTokens;

export default {
  followed,
  isGettingBalance,
  pTokens
};