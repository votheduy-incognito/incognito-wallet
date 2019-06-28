import privacyIcon from '@src/assets/images/cryptoLogo/incognito.png';
import btcIcon from '@src/assets/images/cryptoLogo/bitcoin.png';
import ethIcon from '@src/assets/images/cryptoLogo/ethereum.png';

const customTokenIcon = ethIcon;

const SYMBOL = {
  pETH: 'pETH',
  pBTC: 'pBTC',
  MAIN_PRIVACY: 'PRV'
};

const DATA = {
  [SYMBOL.pETH]: {
    fullName: 'Private ETH',
    typeName: 'Ethereum',
    symbol: 'pETH',
    name: 'pETH',
    icon: ethIcon,
    currencyType: 'ETH',
    isWithdrawable: true,
    isDeposable: true
  },
  [SYMBOL.pBTC]: {
    fullName: 'Private BTC',
    typeName: 'Bitcoin',
    symbol: 'pBTC',
    name: 'pBTC',
    icon: btcIcon,
    currencyType: 'BTC',
    isWithdrawable: true,
    isDeposable: true
  },
  [SYMBOL.MAIN_PRIVACY]: {
    fullName: 'Privacy',
    typeName: 'Incognito',
    symbol: 'PRV',
    name: 'PRV',
    icon: privacyIcon
  },
};

const parse = token => ({
  fullName: token?.name,
  typeName: 'Custom token',
  symbol: token?.symbol,
  name: token?.name,
  icon: customTokenIcon
});


export default {
  DATA, SYMBOL, parse
};