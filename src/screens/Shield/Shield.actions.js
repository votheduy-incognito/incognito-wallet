import {
  selectedPrivacySeleclor,
  accountSeleclor,
  tokenSeleclor,
} from '@src/redux/selectors';
import { getMinMaxDepositAmount } from '@src/services/api/misc';
import {
  genETHDepositAddress,
  genERC20DepositAddress,
  genCentralizedDepositAddress,
} from '@src/services/api/deposit';
import { CONSTANT_COMMONS } from '@src/constants';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import internalTokenModel from '@models/token';
import accountService from '@services/wallet/accountService';
import { setWallet } from '@src/redux/actions/wallet';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
} from './Shield.constant';

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = payload => ({
  type: ACTION_FETCHED,
  payload,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionGetMinMaxShield = async ({ tokenId }) => {
  try {
    return await getMinMaxDepositAmount(tokenId);
  } catch (e) {
    throw 'Can not get min/max amount to deposit';
  }
};

export const actionGetAddressToShield = async ({ selectedPrivacy }) => {
  try {
    let address;
    if (!selectedPrivacy?.isPToken) {
      return null;
    }
    if (
      selectedPrivacy?.externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.ETH
    ) {
      address = await genETHDepositAddress({
        paymentAddress: selectedPrivacy?.paymentAddress,
        walletAddress: selectedPrivacy?.paymentAddress,
        tokenId: selectedPrivacy?.tokenId,
        currencyType: selectedPrivacy?.currencyType,
      });
    } else if (selectedPrivacy?.isErc20Token) {
      address = await genERC20DepositAddress({
        paymentAddress: selectedPrivacy?.paymentAddress,
        walletAddress: selectedPrivacy?.paymentAddress,
        tokenId: selectedPrivacy?.tokenId,
        tokenContractID: selectedPrivacy?.contractId,
        currencyType: selectedPrivacy?.currencyType,
      });
    } else {
      address = await genCentralizedDepositAddress({
        paymentAddress: selectedPrivacy?.paymentAddress,
        walletAddress: selectedPrivacy?.paymentAddress,
        tokenId: selectedPrivacy?.tokenId,
        currencyType: selectedPrivacy?.currencyType,
      });
    }
    if (!address) {
      throw 'Can not gen new deposit address';
    }
    return address;
  } catch (error) {
    throw error;
  }
};

export const actionFollowToken = ({ tokenId }) => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    const wallet = state?.wallet;
    const account = accountSeleclor.defaultAccountSelector(state);
    const pTokens = tokenSeleclor.pTokensSelector(state);
    const internalTokens = tokenSeleclor.internalTokensSelector;
    const foundPToken = pTokens?.find(pToken => pToken?.tokenId === tokenId);
    const foundInternalToken =
      !foundPToken && internalTokens?.find(token => token?.id === tokenId);
    const token =
      (foundInternalToken && internalTokenModel.toJson(foundInternalToken)) ||
      foundPToken?.convertToToken();
    await accountService.addFollowingTokens([token], account, wallet);
    await dispatch(setWallet(wallet));
  } catch (error) {
    throw error;
  }
};

export const actionFetch = ({ tokenId }) => async (dispatch, getState) => {
  try {
    await dispatch(setSelectedPrivacy(tokenId));
    const state = getState();
    const selectedPrivacy = selectedPrivacySeleclor.selectedPrivacy(state);
    if (!selectedPrivacy) {
      return;
    }
    await dispatch(actionFetching());
    const [min, max] = await actionGetMinMaxShield({ tokenId });
    const address = await actionGetAddressToShield({ selectedPrivacy });
    await dispatch(
      actionFetched({
        min,
        max,
        address,
      }),
    );
  } catch (error) {
    await dispatch(actionFetchFail());
    throw error;
  }
};
