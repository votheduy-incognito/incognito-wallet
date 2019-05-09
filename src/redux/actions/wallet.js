import type from '@src/redux/types/wallet';

export const setWallet = (wallet = throw new Error('Wallet object is required')) => ({
  type: type.SET,
  data: wallet
});

export const removeWallet = () => ({
  type: type.REMOVE,
});