import { CONSTANT_COMMONS } from '@src/constants';
import { isIOS, isAndroid } from '@utils/platform';
import { Platform } from 'react-native';

export const detectToken = {
  ispETH: tokenId => tokenId === CONSTANT_COMMONS.TOKEN_ID.pETH,
  ispBTC: tokenId => tokenId === CONSTANT_COMMONS.TOKEN_ID.pBTC,
  ispBNB: tokenId => tokenId === CONSTANT_COMMONS.TOKEN_ID.pBNB,
  ispNEO: tokenId => tokenId === CONSTANT_COMMONS.TOKEN_ID.pNEO,
};

export const generateTestId = (id) => {
  if (isAndroid) {
    return { accessibilityLabel: id, testID: id };
  } else if (isIOS) {
    return { testID: id };
  }
  return { accessibilityLabel: id, testID: id, accessible: true };
};
