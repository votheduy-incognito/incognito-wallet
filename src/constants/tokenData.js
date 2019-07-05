import privacyIcon from '@src/assets/images/cryptoLogo/incognito.png';
import btcIcon from '@src/assets/images/cryptoLogo/bitcoin.png';
import ethIcon from '@src/assets/images/cryptoLogo/ethereum.png';
import { CONSTANT_COMMONS } from '@src/constants';

const customTokenIcon = ethIcon;

const SYMBOL = {
  pETH: CONSTANT_COMMONS.TOKEN_SYMBOL.pETH,
  pBTC: CONSTANT_COMMONS.TOKEN_SYMBOL.pBTC,
  MAIN_CRYPTO_CURRENCY: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV
};

const DATA = {
  [SYMBOL.pETH]: {
    fullName: 'Private ETH',
    typeName: 'Ethereum',
    symbol: CONSTANT_COMMONS.TOKEN_SYMBOL.pETH,
    name: CONSTANT_COMMONS.TOKEN_SYMBOL.pETH,
    icon: ethIcon,
    currencyType: CONSTANT_COMMONS.CRYPTO_SYMBOL.ETH,
    isWithdrawable: true,
    isDeposable: true,
    isNotAllowUnfollow: true
  },
  [SYMBOL.pBTC]: {
    fullName: 'Private BTC',
    typeName: 'Bitcoin',
    symbol: CONSTANT_COMMONS.TOKEN_SYMBOL.pBTC,
    name: CONSTANT_COMMONS.TOKEN_SYMBOL.pBTC,
    icon: btcIcon,
    currencyType: CONSTANT_COMMONS.CRYPTO_SYMBOL.BTC,
    isWithdrawable: true,
    isDeposable: true,
    isNotAllowUnfollow: true
  },
  [SYMBOL.MAIN_CRYPTO_CURRENCY]: {
    fullName: 'Privacy',
    typeName: 'Incognito',
    symbol: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
    name: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
    icon: privacyIcon
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