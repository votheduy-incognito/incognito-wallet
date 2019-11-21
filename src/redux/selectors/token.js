import memoize from 'memoize-one';
import { CONSTANT_CONFIGS, CONSTANT_COMMONS } from '@src/constants';
import { createSelector } from 'reselect';

export const followed = state => state?.token?.followed;
export const isGettingBalance = state => state?.token?.isGettingBalance;
export const pTokens = state => state?.token?.pTokens;
export const internalTokens = state => state?.token?.internalTokens;

const getIconUrlFromTokenId = createSelector(
  internalTokens,
  pTokens,
  (_internalTokens, _pTokens) => memoize((tokenID) => {
    const isNativeToken = tokenID === CONSTANT_COMMONS.PRV_TOKEN_ID; // PRV
    const pToken = _pTokens?.find(t => t.tokenId === tokenID);
    // const formatedTokenId = String(tokenID).toLowerCase();
    let uri;

    if (pToken?.tokenId || isNativeToken) { // use token symbol for pTokens or PRV
      let symbol;
      if (isNativeToken) {
        symbol = CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV;
      } else {
        symbol = pToken?.symbol || pToken?.pSymbol;
      }

      let formatedSymbol = String(symbol).toLowerCase();

      uri = `${CONSTANT_CONFIGS.CRYPTO_ICON_URL}/${formatedSymbol}@2x.png`;
    } else {
      // use token id for incognito tokens
      // uri = `${CONSTANT_CONFIGS.INCOGNITO_TOKEN_ICON_URL}/${formatedTokenId}.png`;

      // dont use incognito tokens for now
      uri = null;
    }

    return uri;
  })
);

export default {
  followed,
  isGettingBalance,
  pTokens,
  internalTokens,
  getIconUrlFromTokenId
};