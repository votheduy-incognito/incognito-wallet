import { CONSTANT_KEYS } from '@src/constants';
import { defaultAccountSelector } from '@src/redux/selectors/account';
import { walletSelector } from '@src/redux/selectors/wallet';
import { ExHandler } from '@src/services/exception';
import accountServices from '@src/services/wallet/accountService';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_INIT,
} from './Streamline.constant';
import {
  streamlineDataSelector,
  streamlineStorageSelector,
} from './Streamline.selector';

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = (payload) => ({
  type: ACTION_FETCHED,
  payload,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionFetch = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const wallet = walletSelector(state);
    const account = defaultAccountSelector(state);
    const keySave = CONSTANT_KEYS.UTXOS_DATA;
    const streamlineStorage = streamlineStorageSelector(state);
    const { isFetching } = streamlineStorage[keySave];
    const { totalFee } = streamlineDataSelector(state);
    if (isFetching) {
      return;
    }
    await dispatch(actionFetching());
    const result = await accountServices.defragmentNativeCoin(
      totalFee,
      true,
      account,
      wallet,
    );
    if (result) {
      const payload = {
        address: account?.paymentAddress,
        utxos: result?.map((item) => item?.txId),
      };
      dispatch(actionFetched(payload));
    }
  } catch (error) {
    dispatch(actionFetchFail());
    new ExHandler(error).showErrorToast();
  }
};

export const actionInit = () => ({
  type: ACTION_INIT,
});
