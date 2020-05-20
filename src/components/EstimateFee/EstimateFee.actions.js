import { getEstimateFeeForNativeToken } from '@src/services/wallet/RpcClientService';
import { selectedPrivacySeleclor, accountSeleclor } from '@src/redux/selectors';
import convert from '@src/utils/convert';
import { change } from 'redux-form';
import format from '@src/utils/format';
import { CONSTANT_COMMONS } from '@src/constants';
import {
  ACTION_FETCHING_FEE,
  ACTION_FETCHED_FEE,
  ACTION_FETCH_FAIL_FEE,
  ACTION_ADD_FEE_TYPE,
  ACTION_CHANGE_FEE_TYPE,
  ACTION_FETCHED_PTOKEN_FEE,
  ACTION_INIT,
} from './EstimateFee.constant';
import { getEstimateFeeForPToken } from './EstimateFee.services';
// eslint-disable-next-line import/no-cycle
import { estimateFeeSelector } from './EstimateFee.selector';
// eslint-disable-next-line import/no-cycle
import { formName } from './EstimateFee.input';
import { MAX_FEE_PER_TX } from './EstimateFee.utils';

export const actionInit = () => ({
  type: ACTION_INIT,
});

export const actionFetchingFee = () => ({
  type: ACTION_FETCHING_FEE,
});

export const actionFetchedFee = payload => ({
  type: ACTION_FETCHED_FEE,
  payload,
});

export const actionFetchFailFee = () => ({
  type: ACTION_FETCH_FAIL_FEE,
});

export const actionFetchFee = ({ amount, address }) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const selectedPrivacy = selectedPrivacySeleclor.selectedPrivacy(state);
  let feeEst = null;
  let feePTokenEst = null;
  try {
    const { isFetching, isFetched } = estimateFeeSelector(state);
    if (
      !amount ||
      !address ||
      !selectedPrivacy?.tokenId ||
      isFetching ||
      isFetched
    ) {
      return;
    }
    await dispatch(actionFetchingFee());
    const maxAmount = selectedPrivacy?.amount;
    const account = accountSeleclor.defaultAccountSelector(state);
    const wallet = state?.wallet;
    const amountConverted = convert.toOriginalAmount(
      convert.toHumanAmount(maxAmount, selectedPrivacy?.pDecimals),
      selectedPrivacy?.pDecimals,
    );
    const fromAddress = account?.PaymentAddress;
    const toAddress = address;
    const accountWallet = wallet.getAccountByName(
      account?.name || account?.AccountName,
    );
    feeEst = await getEstimateFeeForNativeToken(
      fromAddress,
      toAddress,
      amountConverted,
      accountWallet,
    );
    feePTokenEst = await getEstimateFeeForPToken({
      Prv: feeEst,
      TokenID: selectedPrivacy?.tokenId,
    });
  } catch (error) {
    if (!feeEst) {
      feeEst = MAX_FEE_PER_TX;
    }
    //TODO: mockup data
    // if (!feePTokenEst) {
    //   feePTokenEst = feeEst;
    // }
    throw error;
  } finally {
    if (feeEst) {
      await new Promise.all([
        await dispatch(actionFetchedFee(feeEst)),
        await dispatch(
          change(
            formName,
            'fee',
            format.amountFull(feeEst, CONSTANT_COMMONS.PRV.pDecimals),
          ),
        ),
      ]);
    }
    if (feePTokenEst) {
      await new Promise.all([
        await dispatch(
          actionAddFeeType({
            tokenId: selectedPrivacy?.tokenId,
            symbol: selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol,
          }),
        ),
        await dispatch(actionFetchedPTokenFee(feePTokenEst)),
      ]);
    }
  }
};

export const actionAddFeeType = payload => ({
  type: ACTION_ADD_FEE_TYPE,
  payload,
});

export const actionChangeFeeType = payload => ({
  type: ACTION_CHANGE_FEE_TYPE,
  payload,
});

export const actionFetchedPTokenFee = payload => ({
  type: ACTION_FETCHED_PTOKEN_FEE,
  payload,
});
