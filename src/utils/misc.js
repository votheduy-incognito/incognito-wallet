import { CONSTANT_COMMONS } from '@src/constants';

export const detectToken = {
  ispETH: tokenId => tokenId === CONSTANT_COMMONS.TOKEN_ID.pETH,
  ispBTC: tokenId => tokenId === CONSTANT_COMMONS.TOKEN_ID.pBTC,
  ispBNB: tokenId => tokenId === CONSTANT_COMMONS.TOKEN_ID.pBNB,
  ispNEO: tokenId => tokenId === CONSTANT_COMMONS.TOKEN_ID.pNEO,
};
