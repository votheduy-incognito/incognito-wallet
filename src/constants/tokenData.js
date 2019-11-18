import { CONSTANT_COMMONS } from '@src/constants';

const SYMBOL = {
  pETH: CONSTANT_COMMONS.TOKEN_SYMBOL.pETH,
  pBTC: CONSTANT_COMMONS.TOKEN_SYMBOL.pBTC,
  pBNB:  CONSTANT_COMMONS.TOKEN_SYMBOL.pBNB,
  MAIN_CRYPTO_CURRENCY: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
  pKCS: CONSTANT_COMMONS.TOKEN_SYMBOL.pKCS
};

const DATA = {
  [CONSTANT_COMMONS.PRV_TOKEN_ID]: {
    typeName: 'Incognito',
    symbol: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
    name: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
  },
};

const parse = token => ({
  typeName: 'Custom token',
  symbol: token?.symbol,
  name: token?.name,
  isTokenFollowedByUser: true,
});


export default {
  DATA, SYMBOL, parse
};
