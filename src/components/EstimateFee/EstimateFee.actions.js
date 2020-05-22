import { getEstimateFeeForNativeToken } from '@src/services/wallet/RpcClientService';
import { selectedPrivacySeleclor, accountSeleclor } from '@src/redux/selectors';
import convert from '@src/utils/convert';
import { change, focus } from 'redux-form';
import format from '@src/utils/format';
import { CONSTANT_COMMONS } from '@src/constants';
import floor from 'lodash/floor';
import {
  ACTION_FETCHING_FEE,
  ACTION_FETCHED_FEE,
  ACTION_FETCH_FAIL_FEE,
  ACTION_ADD_FEE_TYPE,
  ACTION_CHANGE_FEE_TYPE,
  ACTION_FETCHED_PTOKEN_FEE,
  ACTION_FETCHED_MIN_PTOKEN_FEE,
  ACTION_CHANGE_FEE,
  ACTION_INIT,
  ACTION_INIT_FETCHED,
} from './EstimateFee.constant';
import { getEstimateFeeForPToken } from './EstimateFee.services';
// eslint-disable-next-line import/no-cycle
import { estimateFeeSelector } from './EstimateFee.selector';
// eslint-disable-next-line import/no-cycle
import { formName } from './EstimateFee.input';
import { MAX_FEE_PER_TX, DEFAULT_FEE_PER_KB } from './EstimateFee.utils';

export const actionInit = payload => ({
  type: ACTION_INIT,
  payload,
});

export const actionInitFetched = () => ({
  type: ACTION_INIT_FETCHED,
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
  let minFeePTokenEst = null;
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
    const account = accountSeleclor.defaultAccountSelector(state);
    const wallet = state?.wallet;
    const amountConverted = convert.toOriginalAmount(
      convert.toHumanAmount(amount, selectedPrivacy?.pDecimals),
      selectedPrivacy?.pDecimals,
    );
    const fromAddress = account?.PaymentAddress;
    const toAddress = address;
    const accountWallet = wallet.getAccountByName(
      account?.name || account?.AccountName,
    );
    const [estEstData, minFeePTokenEstData] = await new Promise.all([
      await getEstimateFeeForNativeToken(
        fromAddress,
        toAddress,
        amountConverted,
        accountWallet,
      ),
      await getEstimateFeeForPToken({
        Prv: DEFAULT_FEE_PER_KB, //min fee prv
        TokenID: selectedPrivacy?.tokenId,
      }),
    ]);
    feeEst = estEstData;
    minFeePTokenEst = minFeePTokenEstData;
    if (!selectedPrivacy?.isMainCrypto) {
      feePTokenEst = await getEstimateFeeForPToken({
        Prv: feeEst,
        TokenID: selectedPrivacy?.tokenId,
      });
    }
  } catch (error) {
    if (!feeEst) {
      feeEst = MAX_FEE_PER_TX;
    }
    throw error;
  } finally {
    if (feeEst) {
      const feePrv = floor(feeEst);
      const feePrvText = format.toFixed(
        convert.toHumanAmount(feePrv, CONSTANT_COMMONS.PRV.pDecimals),
        CONSTANT_COMMONS.PRV.pDecimals,
      );
      await new Promise.all([
        await dispatch(
          actionFetchedFee({
            feePrv,
            feePrvText,
          }),
        ),
        await dispatch(change(formName, 'fee', feePrvText)),
        await dispatch(focus(formName, 'fee')),
      ]);
    }
    if (feePTokenEst) {
      const feePToken = floor(feePTokenEst);
      const feePTokenText = format.toFixed(
        convert.toHumanAmount(feePToken, selectedPrivacy?.pDecimals),
        selectedPrivacy?.pDecimals,
      );
      await dispatch(
        actionFetchedPTokenFee({
          feePToken,
          feePTokenText,
        }),
      );
    }
    if (minFeePTokenEst) {
      const minFeePToken = floor(minFeePTokenEst);
      const minFeePTokenText = format.toFixed(
        convert.toHumanAmount(minFeePToken, selectedPrivacy?.pDecimals),
        selectedPrivacy?.pDecimals,
      );
      const maxFeePToken = selectedPrivacy?.amount;
      const maxFeePTokenText = format.toFixed(
        convert.toHumanAmount(maxFeePToken, selectedPrivacy?.pDecimals),
      );
      await new Promise.all([
        await dispatch(
          actionAddFeeType({
            tokenId: selectedPrivacy?.tokenId,
            symbol: selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol,
          }),
        ),
        await dispatch(
          actionFetchedMinPTokenFee({
            minFeePToken,
            minFeePTokenText,
            maxFeePToken,
            maxFeePTokenText,
          }),
        ),
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

export const actionFetchedMinPTokenFee = payload => ({
  type: ACTION_FETCHED_MIN_PTOKEN_FEE,
  payload,
});

export const actionChangeFee = payload => ({
  type: ACTION_CHANGE_FEE,
  payload,
});
