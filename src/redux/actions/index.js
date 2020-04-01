import accountService from '@src/services/wallet/accountService';
import {accountSeleclor} from '@src/redux/selectors';
import internalTokenModel from '@models/token';
import PToken from '@src/models/pToken';
import {setWallet} from './wallet';
import {actionAddFollowTokenSuccess, actionAddFollowTokenFail} from './token';

export const actionAddFollowToken = tokenId => async (dispatch, getState) => {
  try {
    const state = getState();
    const account = accountSeleclor.defaultAccount(state);
    const wallet = state.wallet;
    const {pTokens, internalTokens} = state.token;
    const foundPToken: PToken = pTokens?.find(
      (pToken: PToken) => pToken.tokenId === tokenId,
    );
    const foundInternalToken =
      !foundPToken && internalTokens?.find(token => token.id === tokenId);
    const token =
      (foundInternalToken && internalTokenModel.toJson(foundInternalToken)) ||
      foundPToken?.convertToToken();
    if (!token) throw new Error('Can not follow empty coin');
    await accountService.addFollowingTokens([token], account, wallet);
    await dispatch(setWallet(wallet));
    await dispatch(actionAddFollowTokenSuccess(tokenId));
  } catch (error) {
    dispatch(actionAddFollowTokenFail(tokenId));
    throw Error(error);
  }
};
