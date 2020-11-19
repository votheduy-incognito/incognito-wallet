import React, {memo, useMemo} from 'react';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import styles from '@screens/DexV2/components/ExchangeRate/style';
import { View, Text } from '@components/core';
import Help from '@components/Help';
import routeNames from '@routers/routeNames';
import helperConst from '@src/constants/helper';
import { useNavigation } from 'react-navigation-hooks';
import {calculateSizeImpact} from '@screens/DexV2/components/Trade/utils';
import stylesheet from '@screens/DexV2/components/ExtraInfo/style';
import {COLORS} from '@src/styles';
import PropTypes from 'prop-types';

const PriceImpact = (props) => {
  const {
    inputValue,
    inputToken,
    minimumAmount,
    outputToken
  } = props;
  const navigation = useNavigation();

  const {
    impact: impactValue,
    showWarning
  } = calculateSizeImpact(inputValue, inputToken, minimumAmount, outputToken);
  const Impact = useMemo(() => {
    if (impactValue) {
      return (
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[stylesheet.text, stylesheet.textLeft, { color: showWarning ? COLORS.orange : COLORS.black, marginRight: 0 }]}>
            {`${impactValue}%`}
          </Text>
        </View>
      );
    }
    return null;
  }, [impactValue, showWarning]);

  const onHelpPress = () => {
    navigation.navigate(routeNames.Helper, helperConst.HELPER_CONSTANT.PRICE_IMPACT);
  };

  return (
    <ExtraInfo
      left={(
        <View style={styles.row}>
          <Text style={styles.extra}>Price Impact</Text>
          <Help onPress={onHelpPress} />
        </View>
      )}
      right={Impact}
    />
  );
};

PriceImpact.propTypes = {
  inputToken: PropTypes.object.isRequired,
  inputValue: PropTypes.number.isRequired,
  outputToken: PropTypes.object.isRequired,
  minimumAmount: PropTypes.number,
};

PriceImpact.defaultProps = {
  minimumAmount: 0,
};

export default memo(PriceImpact);