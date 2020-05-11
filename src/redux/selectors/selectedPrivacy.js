import { createSelector } from 'reselect';

import SelectedPrivacy from '@src/models/selectedPrivacy';
import memoize from 'memoize-one';
import { CONSTANT_COMMONS } from '@src/constants';
import { ExHandler } from '@src/services/exception';
import { defaultAccount } from './account';
import { followed, pTokens, internalTokens } from './token';

export const selectedPrivacyTokenID = (state) => state?.selectedPrivacy?.tokenID;

export const getPrivacyDataByTokenID = createSelector(
  defaultAccount,
  internalTokens,
  pTokens,
  followed,
  (account, _internalTokens, _pTokens, _followed) => memoize((tokenID) => {
    try {
      // 'PRV' is not a token
      const internalTokenData = _internalTokens?.find(t => t?.id !== CONSTANT_COMMONS.PRV_TOKEN_ID && t?.id === tokenID) || {};
      const pTokenData = _pTokens?.find(t => t?.tokenId === tokenID);
      const followedTokenData = _followed.find(t => t?.id === tokenID) || {};

      if (!internalTokenData && !pTokenData && tokenID !== CONSTANT_COMMONS.PRV_TOKEN_ID) {
        throw new Error(`Can not find coin with id ${tokenID}`);
      }

      return new SelectedPrivacy(account, { ...internalTokenData, ...followedTokenData }, pTokenData);
    } catch (e) {
      new ExHandler(e);
    }
  })
);


export const getPrivacyDataBaseOnAccount = createSelector(
  // defaultAccount,
  internalTokens,
  pTokens,
  followed,
  selectedPrivacyTokenID,
  (_internalTokens, _pTokens, _followed, tokenID) => account => {
    try {
      // 'PRV' is not a token
      const internalTokenData = _internalTokens?.find(t => t?.id !== CONSTANT_COMMONS.PRV_TOKEN_ID && t?.id === tokenID) || {};
      const pTokenData = _pTokens?.find(t => t?.tokenId === tokenID);
      const followedTokenData = _followed.find(t => t?.id === tokenID) || {};

      if (!internalTokenData && !pTokenData && tokenID !== CONSTANT_COMMONS.PRV_TOKEN_ID) {
        throw new Error(`Can not find coin with id ${tokenID}`);
      }

      return new SelectedPrivacy(account, { ...internalTokenData, ...followedTokenData }, pTokenData);
    } catch (e) {
      new ExHandler(e);
    }
  } 
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
  selectedPrivacy,
  getPrivacyDataBaseOnAccount
};
