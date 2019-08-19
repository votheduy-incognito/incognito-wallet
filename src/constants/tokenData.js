import privacyIcon from '@src/assets/images/cryptoLogo/incognito.png';
import btcIcon from '@src/assets/images/cryptoLogo/bitcoin.png';
import ethIcon from '@src/assets/images/cryptoLogo/ethereum.png';
import binanceIcon from '@src/assets/images/cryptoLogo/binance.png';
import kcsIcon from '@src/assets/images/cryptoLogo/kcs.png';
import { CONSTANT_COMMONS } from '@src/constants';

const customTokenIcon = ethIcon;

const SYMBOL = {
  pETH: CONSTANT_COMMONS.TOKEN_SYMBOL.pETH,
  pBTC: CONSTANT_COMMONS.TOKEN_SYMBOL.pBTC,
  pBNB:  CONSTANT_COMMONS.TOKEN_SYMBOL.pBNB,
  MAIN_CRYPTO_CURRENCY: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
  pKCS: 'pKCS'
};

const DATA = {
  [SYMBOL.pETH]: {
    fullName: 'Private ETH',
    icon: ethIcon,
  },
  [SYMBOL.pBTC]: {
    fullName: 'Private BTC',
    icon: btcIcon,
  },
  [SYMBOL.pBNB]: {
    fullName: 'Private BNB',
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
    fullName: 'Private KCS',
    icon: kcsIcon,
  },
};

const parse = token => ({
  fullName: token?.name,
  typeName: 'Custom token',
  symbol: token?.symbol,
  name: token?.name,
  icon: customTokenIcon,
  isTokenFollowedByUser: true,
});


export default {
  DATA, SYMBOL, parse
};