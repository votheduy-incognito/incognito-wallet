import _ from 'lodash';
import { COINS } from '@src/constants';
import { useSelector } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import BigNumber from 'bignumber.js';
import formatUtils from '@utils/format';
import convertUtil from '@utils/convert';

export const calculateOutputValueCrossPool = (pairs, inputToken, inputValue, outputToken) => {
  const firstPair = _.get(pairs, 0);
  const secondPair = _.get(pairs, 1);

  let currentInputToken = inputToken;
  let outputValue = inputValue;

  if (secondPair) {
    outputValue = calculateOutputValue(firstPair, currentInputToken, outputValue, COINS.PRV);
    currentInputToken = COINS.PRV;
  }

  outputValue = calculateOutputValue(secondPair || firstPair, currentInputToken, outputValue, outputToken);

  if (outputValue < 0) {
    outputValue = 0;
  }

  return outputValue;
};

export const calculateOutputValue = (pair, inputToken, inputValue, outputToken) => {
  try {
    if (!pair) {
      return 0;
    }
    const inputPool = pair[inputToken.id];
    const outputPool = pair[outputToken.id];
    const initialPool = inputPool * outputPool;
    const newInputPool = inputPool + inputValue;
    const newOutputPoolWithFee = _.ceil(initialPool / newInputPool);
    return outputPool - newOutputPoolWithFee;
  } catch (error) {
    console.debug('CALCULATE OUTPUT', error);
  }
};

export const calculateInputValue = (pair, inputToken, outputValue, outputToken) => {
  try {
    const inputPool = pair[inputToken.id];
    const outputPool = pair[outputToken.id];
    const initialPool = inputPool * outputPool;
    return _.ceil((initialPool) / (outputPool - outputValue)) - inputPool;
  } catch (error) {
    console.debug('CALCULATE OUTPUT', error);
  }
};

const getImpact = (input, output) => {
  input   = BigNumber(input);
  output  = BigNumber(output);
  return output
    .minus(input)
    .dividedBy(input)
    .multipliedBy(100)
    .toNumber();
};

export const calculateSizeImpact = (inputValue, inputToken, outputValue, outputToken) => {
  const {
    priceUsd:   inputPriceUsd,
    pDecimals:  inputPDecimals
  } = useSelector(selectedPrivacySeleclor.getPrivacyDataByTokenID)(inputToken?.id);
  const {
    priceUsd:   outputPriceUsd,
    pDecimals:  outputPDecimals
  } = useSelector(selectedPrivacySeleclor.getPrivacyDataByTokenID)(outputToken?.id);
  const totalInputUsd   = convertUtil.toHumanAmount(inputValue * inputPriceUsd, inputPDecimals);
  const totalOutputUsd  = convertUtil.toHumanAmount(outputValue * outputPriceUsd, outputPDecimals);
  if (totalInputUsd && totalInputUsd !== 0) {
    const impact = formatUtils.fixedNumber(getImpact(totalInputUsd, totalOutputUsd), 3);
    if (!isNaN(impact)) {
      return {
        impact: impact > 0 ? `+${impact}` : impact,
        showWarning: impact < -5
      };
    }
  }
  return {
    impact: null,
    showWarning: false
  };
};
