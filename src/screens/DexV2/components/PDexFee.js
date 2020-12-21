import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import styles from '@screens/DexV2/components/Trade/style';
import { Text } from '@components/core';
import stylesheet from '@screens/DexV2/components/ExtraInfo/style';
import Help from '@components/Help';
import format from '@utils/format';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import helperConst  from '@src/constants/helper';
import { totalFeeSelector } from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';
import { useSelector } from 'react-redux';

const PDexFee = ({
  feeToken,
  leftStyle
}) => {
  const navigation = useNavigation();

  const pDexFee = useSelector(totalFeeSelector)();

  const onHelpPress = () => {
    navigation.navigate(routeNames.Helper, helperConst.HELPER_CONSTANT.FEE);
  };

  const renderFee = () => (
    <>
      <ExtraInfo
        token={feeToken}
        left={(
          <View style={styles.row}>
            <Text style={[stylesheet.text, stylesheet.textLeft, leftStyle]}>Fee</Text>
            <Help onPress={onHelpPress} />
          </View>
        )}
        right={`${pDexFee} ${
          feeToken.symbol
        }`}
        style={styles.extra}
      />
    </>
  );

  return (
    <View>
      {renderFee()}
    </View>
  );
};

PDexFee.propTypes = {
  feeToken: PropTypes.object.isRequired,
  leftStyle: PropTypes.object.isRequired
};

export default memo(PDexFee);