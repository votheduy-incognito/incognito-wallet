import _ from 'lodash';
import convertUtil from '@utils/convert';
import formatUtil from '@utils/format';

export const DEX = {
  MAIN_ACCOUNT: 'pDEX',
  WITHDRAW_ACCOUNT: 'pDEXWithdraw',
};

export default {
  isDEXAccount(accountName) {
    if (!accountName) {
      return false;
    }

    const name = accountName.toLowerCase();
    return name === DEX.WITHDRAW_ACCOUNT.toLowerCase() || name === DEX.MAIN_ACCOUNT.toLowerCase();
  },

  isDEXMainAccount(accountName) {
    if (!accountName) {
      return false;
    }

    const name = accountName.toLowerCase();
    return name === DEX.MAIN_ACCOUNT.toLowerCase();
  },

  isDEXWithdrawAccount(accountName) {
    if (!accountName) {
      return false;
    }

    const name = accountName.toLowerCase();
    return name === DEX.WITHDRAW_ACCOUNT.toLowerCase();
  },

  getPair(tokenId1, tokenId2, pairs) {
    return pairs.find(pair => {
      const keys = Object.keys(pair);
      return keys.includes(tokenId1) && keys.includes(tokenId2);
    });
  },

  calculateValue(inputToken, inputValue, outputToken, pair) {
    if (!pair) {
      return;
    }

    if (!outputToken || !_.isNumber(inputValue) || _.isNaN(inputValue) || !inputValue) {
      return { outputValue: 0, outputText: '0' };
    }

    const inputPool = pair[inputToken.id];
    const outputPool = pair[outputToken.id];
    // const initialPool = inputPool / outputPool;
    // const newInputPool = inputPool + inputValue;
    const outputValue = _.floor((inputValue * outputPool) / inputPool);
    const outputOriginal = convertUtil.toHumanAmount(outputValue, outputToken.pDecimals);
    const outputText = formatUtil.toFixed(outputOriginal, outputToken.pDecimals);
    return { outputValue, outputText, pair };
  }
};
