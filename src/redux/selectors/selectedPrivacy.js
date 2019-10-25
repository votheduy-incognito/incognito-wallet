import { createSelector } from 'reselect';
import SelectedPrivacy from '@src/models/selectedPrivacy';
import memoize from 'memoize-one';
import { CONSTANT_COMMONS } from '@src/constants';
import { defaultAccount } from './account';
import { followed, pTokens, internalTokens } from './token';

export const selectedPrivacyTokenID = state => state?.selectedPrivacy?.tokenID;

export const getPrivacyDataByTokenID = createSelector(
  defaultAccount,
  internalTokens,
  pTokens,
  followed,
  (account, _internalTokens, _pTokens, _followed) => memoize((tokenID) => {
    let internalTokenData = _followed.find(t => t?.id === tokenID);

    if (!internalTokenData) {
      // 'PRV' is not a token
      internalTokenData = _internalTokens?.find(t => t?.id !== CONSTANT_COMMONS.PRV_TOKEN_ID && t?.id === tokenID);
    }

    const pTokenData = _pTokens?.find(t => t?.tokenId === tokenID);

    if (!internalTokenData && !pTokenData && tokenID !== CONSTANT_COMMONS.PRV_TOKEN_ID) {
      throw new Error(`Can not find token with id ${tokenID}`);
    }

    return new SelectedPrivacy(account, internalTokenData, pTokenData);
  })
);

export const selectedPrivacy = createSelector(
  selectedPrivacyTokenID,
  getPrivacyDataByTokenID,
  (selectedSymbol, getFn) => {
    return getFn(selectedSymbol);
  }
);

export default {
  getPrivacyDataByTokenID,
  selectedPrivacyTokenID,
  selectedPrivacy
};