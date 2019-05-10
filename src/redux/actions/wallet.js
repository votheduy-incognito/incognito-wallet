import { loadListAccount } from '@src/services/wallet/WalletService';
import type from '@src/redux/types/wallet';
import { setBulkAccount } from '@src/redux/actions/account';

export const setWallet = (wallet = throw new Error('Wallet object is required')) => ({
  type: type.SET,
  data: wallet
});

export const removeWallet = () => ({
  type: type.REMOVE,
});

export const reloadAccountList = () => (dispatch, getState) => {
  const wallet = getState()?.wallet;
  if (!wallet) {
    return;
  }

  return loadListAccount(wallet)
    .then(accounts => {
      dispatch(setBulkAccount(accounts));
    });
};