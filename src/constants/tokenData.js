import privacyIcon from '@src/assets/images/cryptoLogo/incognito.png';
import btcIcon from '@src/assets/images/cryptoLogo/bitcoin.png';
import ethIcon from '@src/assets/images/cryptoLogo/ethereum.png';

const SYMBOL = {
  pETH: 'pETH',
  pBTC: 'pBTC',
  PRV: 'PRV'
};

const DATA = {
  [SYMBOL.pETH]: {
    fullName: 'Private ETH',
    typeName: 'Ethereum',
    symbol: 'pETH',
    name: 'pETH',
    icon: ethIcon
  },
  [SYMBOL.pBTC]: {
    fullName: 'Private BTC',
    typeName: 'Bitcoin',
    symbol: 'pBTC',
    name: 'pBTC',
    icon: btcIcon
  },
  [SYMBOL.PRV]: {
    fullName: 'Privacy',
    typeName: 'Incognito',
    symbol: 'PRV',
    name: 'PRV',
    icon: privacyIcon
  }
};

export default {
  DATA, SYMBOL
};