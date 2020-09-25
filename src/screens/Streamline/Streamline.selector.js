import { accountSeleclor } from '@src/redux/selectors';
import { walletSelector } from '@src/redux/selectors/wallet';
import { createSelector } from 'reselect';
import accountServices from '@src/services/wallet/accountService';
import { CONSTANT_COMMONS } from '@src/constants';
import { MAX_FEE_PER_TX } from '@src/components/EstimateFee/EstimateFee.utils';

export const streamlineSelector = createSelector(
  (state) => state.streamline,
  (streamline) => streamline,
);

export const streamlineStorageSelector = createSelector(
  streamlineSelector,
  (streamline) => streamline?.storage,
);

export const streamlineDataSelector = createSelector(
  walletSelector,
  accountSeleclor.defaultAccountSelector,
  (wallet, account) => {
    const MAX_UTXOS_PER_DEFRAGMENT_PROCESS =
      accountServices.MAX_DEFRAGMENT_TXS *
      accountServices.NO_OF_INPUT_PER_DEFRAGMENT_TX;
    const UTXONativeCoin = accountServices.getUTXOs(
      wallet,
      account,
      CONSTANT_COMMONS.PRV.id,
    );
    const maxInputPerTx = accountServices.NO_OF_INPUT_PER_DEFRAGMENT_TX;
    const totalFee = MAX_FEE_PER_TX * Math.ceil(UTXONativeCoin / maxInputPerTx);
    const times = Math.ceil(UTXONativeCoin / MAX_UTXOS_PER_DEFRAGMENT_PROCESS);
    return {
      totalFee,
      UTXONativeCoin,
      times,
    };
  },
);
