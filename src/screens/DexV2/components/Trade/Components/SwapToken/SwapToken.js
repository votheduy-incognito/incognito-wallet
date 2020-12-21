import React, { memo } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import styles from '@screens/DexV2/components/Trade/style';
import { Divider } from 'react-native-elements';
import { Image, TouchableOpacity } from '@components/core';
import downArrow from '@assets/images/icons/circle_arrow_down.png';

const SwapToken = ({ onSwapTokens }) => (
  <View style={styles.arrowWrapper}>
    <Divider style={styles.divider} />
    <TouchableOpacity onPress={onSwapTokens}>
      <Image source={downArrow} style={styles.arrow} />
    </TouchableOpacity>
    <Divider style={styles.divider} />
  </View>
);

SwapToken.propTypes = {
  onSwapTokens: PropTypes.func.isRequired
};

export default memo(SwapToken);