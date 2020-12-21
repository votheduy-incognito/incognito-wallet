import React, { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from '@screens/DexV2/components/Trade/Components/Slippage/styles';
import {COLORS} from '@src/styles';

const ButtonToken = memo(({
  title,
  isSelected,
  onPress
}) => {
  return (
    <TouchableOpacity
      style={{ paddingLeft: 10 }}
      onPress={onPress}
    >
      <Text style={[
        styles.defaultTextStyle,
        styles.unitSlippageStyle,
        !isSelected && { color: COLORS.colorGreyBold }
      ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
});

ButtonToken.propTypes = {
  title: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
};


export default ButtonToken;