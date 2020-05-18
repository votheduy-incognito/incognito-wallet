import { selectedPrivacySeleclor, accountSeleclor } from '@src/redux/selectors';
import { apiEstimateFee } from '@src/components/EstimateFee/EstimateFee.services';
import { getEstimateFeeForNativeToken } from '@src/services/wallet/RpcClientService';
import convert from '@src/utils/convert';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_CHOOSE_MAX_AMOUNT,
  ACTION_INIT,
} from './Send.constant';
import { sendSelector } from './Send.selector';

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = payload => ({
  type: ACTION_FETCHED,
  payload,
});

export const actionFetchFail = payload => ({
  type: ACTION_FETCH_FAIL,
  payload,
});

export const actionFetch = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { isFetching } = sendSelector(state);
    const account = accountSeleclor.defaultAccountSelector(state);
    const selectedPrivacy = selectedPrivacySeleclor.selectedPrivacy(state);
    const wallet = state?.wallet;
    const walletAccount = wallet.getAccountByName(
      account?.name || account?.AccountName,
    );
    if (isFetching) {
      return;
    }
    await dispatch(actionFetching());
    const fee = await getEstimateFeeForNativeToken(
      account?.PaymentAddress,
      account?.PaymentAddress,
      selectedPrivacy?.amount,
      walletAccount,
    );
    await dispatch(
      actionFetched({
        min: 1,
        max: selectedPrivacy?.amount,
        fee,
      }),
    );
  } catch (error) {
    await dispatch(actionFetchFail(error));
  }
};

export const actionInitData = payload => ({
  type: ACTION_INIT,
  payload,
});

export const actionChooseMaxAmount = payload => ({
  type: ACTION_CHOOSE_MAX_AMOUNT,
  payload,
});
