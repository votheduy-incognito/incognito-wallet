import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import formatUtil from '@utils/format';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import { Text, View } from '@components/core/index';
import Help from '@components/Help/index';
import styles from './style';

const ExchangeRate = ({
  inputToken,
  inputValue,
  outputToken,
  minimumAmount,
}) => {
  let right = '';

  if (!(
    !outputToken ||
      !minimumAmount ||
      !_.isNumber(minimumAmount) ||
      !inputValue || !_.isNumber(inputValue)
  )) {
    const minRate = (inputValue / Math.pow(10, inputToken.pDecimals || 0)) / (minimumAmount / Math.pow(10, outputToken.pDecimals));

    let maxDigits = minRate > 1 ? 4 : 9;
    maxDigits = minRate > 1e6 ? 0: maxDigits;

    const floorMinRate = _.floor(minRate, Math.min(outputToken.pDecimals, maxDigits));

    right = `${formatUtil.amount(floorMinRate)} ${inputToken?.symbol} / ${outputToken.symbol}`;
  }

  return (
    <ExtraInfo
      left={(
        <View style={styles.row}>
          <Text style={styles.extra}>Max price</Text>
          <Help title="Max price" content={`Your order will go through if the price is ${right || 'X'}, or better.`} />
        </View>
      )}
      right={right}
    />
  );
};

ExchangeRate.propTypes = {
  inputToken: PropTypes.object.isRequired,
  inputValue: PropTypes.number.isRequired,
  outputToken: PropTypes.object.isRequired,
  minimumAmount: PropTypes.number,
};

ExchangeRate.defaultProps = {
  minimumAmount: 0,
};

export default ExchangeRate;
