import privacyIcon from '@src/assets/images/cryptoLogo/incognito.png';
import btcIcon from '@src/assets/images/cryptoLogo/bitcoin.png';
import ethIcon from '@src/assets/images/cryptoLogo/ethereum.png';
import binanceIcon from '@src/assets/images/cryptoLogo/binance.png';
import kcsIcon from '@src/assets/images/cryptoLogo/kcs.png';
import { CONSTANT_COMMONS } from '@src/constants';
import Util from '@src/utils/Util';

const customTokenIcon = (symbol ):String=>{
  return Util.getIconLinkWithSymbol(symbol);
};

const SYMBOL = {
  pETH: CONSTANT_COMMONS.TOKEN_SYMBOL.pETH,
  pBTC: CONSTANT_COMMONS.TOKEN_SYMBOL.pBTC,
  pBNB:  CONSTANT_COMMONS.TOKEN_SYMBOL.pBNB,
  MAIN_CRYPTO_CURRENCY: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
  pKCS: CONSTANT_COMMONS.TOKEN_SYMBOL.pKCS
};

const DATA = {
  [SYMBOL.pETH]: {
    icon: ethIcon,
  },
  [SYMBOL.pBTC]: {
    icon: btcIcon,
  },
  [SYMBOL.pBNB]: {
    icon: binanceIcon,
  },
  [SYMBOL.MAIN_CRYPTO_CURRENCY]: {
    fullName: 'Privacy',
    typeName: 'Incognito',
    symbol: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
    name: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
    icon: privacyIcon
  },
  [SYMBOL.pKCS]: {
    icon: kcsIcon,
  },
};

const parse = token => ({
  typeName: 'Custom token',
  symbol: token?.symbol,
  name: token?.name,
  icon: null,
  isTokenFollowedByUser: true,
});


export default {
  DATA, SYMBOL, parse
};