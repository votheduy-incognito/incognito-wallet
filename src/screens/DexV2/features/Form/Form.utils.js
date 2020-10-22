import _ from 'lodash';
import { COINS } from '@src/constants';

export const calculateOutputValueCrossPool = (
  pairs,
  inputToken,
  inputValue,
  outputToken,
) => {
  const firstPair = _.get(pairs, 0);
  const secondPair = _.get(pairs, 1);

  let currentInputToken = inputToken;
  let outputValue = inputValue;

  if (secondPair) {
    outputValue = calculateOutputValue(
      firstPair,
      currentInputToken,
      outputValue,
      COINS.PRV,
    );
    currentInputToken = COINS.PRV;
  }

  outputValue = calculateOutputValue(
    secondPair || firstPair,
    currentInputToken,
    outputValue,
    outputToken,
  );

  if (outputValue < 0) {
    outputValue = 0;
  }

  return outputValue;
};

export const calculateOutputValue = (
  pair,
  inputToken,
  inputValue,
  outputToken,
) => {
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

export const calculateInputValue = (
  pair,
  inputToken,
  outputValue,
  outputToken,
) => {
  try {
    const inputPool = pair[inputToken.id];
    const outputPool = pair[outputToken.id];
    const initialPool = inputPool * outputPool;
    return _.ceil(initialPool / (outputPool - outputValue)) - inputPool;
  } catch (error) {
    console.debug('CALCULATE OUTPUT', error);
  }
};
