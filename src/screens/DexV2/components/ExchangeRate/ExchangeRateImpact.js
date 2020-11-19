import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { isNumber } from 'lodash';
import formatUtil from '@utils/format';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import { Text, View } from '@components/core/index';
import Help from '@components/Help';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import helperConst from '@src/constants/helper';
import { COLORS } from '@src/styles';
import stylesheet from '@screens/DexV2/components/ExtraInfo/style';
import { calculateSizeImpact } from '@screens/DexV2/components/Trade/utils';
import styles from './style';

const ExchangeRateImpact = ({
  inputToken,
  inputValue,
  outputToken,
  minimumAmount,
}) => {
  const navigation = useNavigation();

  let right   = '';

  const {
    impact: impactValue,
    showWarning
  } = calculateSizeImpact(inputValue, inputToken, minimumAmount, outputToken);
  const Impact = useMemo(() => {
    if (impactValue) {
      return (
        <Text style={[stylesheet.text, stylesheet.textLeft, { color: showWarning ? COLORS.orange : COLORS.black, marginRight: 0 }]}>
          {`(${impactValue})%`}
        </Text>
      );
    }
    return null;
  }, [impactValue, showWarning]);

  if (!(
    !outputToken ||
    !minimumAmount ||
    !isNumber(minimumAmount) ||
    !inputValue || !isNumber(inputValue)
  )) {
    const minRate = (inputValue / Math.pow(10, inputToken.pDecimals || 0)) / (minimumAmount / Math.pow(10, outputToken.pDecimals));
    let maxPrice = '';
    if (minRate >= 1) {
      maxPrice = `${formatUtil.amount(minRate, 0, true)} ${inputToken?.symbol} / ${outputToken.symbol}`;
    } else {
      maxPrice = `${formatUtil.toFixed(minRate, 9)} ${inputToken?.symbol} / ${outputToken.symbol}`;
    }
    right = (
      <View style={{ alignItems: 'flex-end' }}>
        <Text
          numberOfLines={1}
          ellipsizeMode='tail'
          style={[stylesheet.text, stylesheet.textLeft, { marginRight: 0 }]}
        >
          {maxPrice}
        </Text>
        {Impact || null}
      </View>
    );
  }
  const onHelpPress = () => {
    navigation.navigate(routeNames.Helper, helperConst.HELPER_CONSTANT.MAX_PRICE_IMPACT);
  };

  return (
    <ExtraInfo
      left={(
        <View style={styles.row}>
          <Text style={styles.extra}>Max price & impact</Text>
          <Help onPress={onHelpPress} />
        </View>
      )}
      right={right}
    />
  );
};

ExchangeRateImpact.propTypes = {
  inputToken: PropTypes.object.isRequired,
  inputValue: PropTypes.number.isRequired,
  outputToken: PropTypes.object.isRequired,
  minimumAmount: PropTypes.number,
};

ExchangeRateImpact.defaultProps = {
  minimumAmount: 0,
};

export default memo(ExchangeRateImpact);
