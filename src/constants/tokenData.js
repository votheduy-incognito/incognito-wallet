import { CONSTANT_COMMONS } from '@src/constants';

const SYMBOL = {
  pETH: CONSTANT_COMMONS.TOKEN_SYMBOL.pETH,
  pBTC: CONSTANT_COMMONS.TOKEN_SYMBOL.pBTC,
  pBNB:  CONSTANT_COMMONS.TOKEN_SYMBOL.pBNB,
  MAIN_CRYPTO_CURRENCY: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
  pKCS: CONSTANT_COMMONS.TOKEN_SYMBOL.pKCS
};

const DATA = {
  [SYMBOL.MAIN_CRYPTO_CURRENCY]: {
    fullName: 'Privacy',
    typeName: 'Incognito',
    symbol: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
    name: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
  },
};

export const TOKEN_TYPES = {
  INCOGNITO: 0,
  ERC20: 3,
  BEP2: 5,
};

const parse = token => ({
  typeName: 'Custom token',
  symbol: token?.symbol,
  name: token?.name,
  isTokenFollowedByUser: true,
});


export default {
  DATA, SYMBOL, parse, TOKEN_TYPES
};
