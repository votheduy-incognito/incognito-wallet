import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '@src/styles';
import TouchableOpacity from '../TouchableOpacity';
import BaseTextInput from '../BaseTextInput';
import Text from '../Text';
import View from '../View';

const InputWithMax = ({ style, maxValue, onChangeText, ...props }) => {
  return (
    <View>
      <BaseTextInput
        {...props}
        style={[style, {paddingRight: 60}]}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        style={{
          paddingHorizontal: 15,
          paddingVertical: 5,
          borderWidth: 1,
          borderRadius: 15,
          borderColor: COLORS.primary,
          marginBottom: 5,
          position: 'absolute',
          bottom: 0,
          right: 0,
        }}
        onPress={() => {
          onChangeText(maxValue);
        }}
      >
        <Text style={{ color: COLORS.primary  }}>Max</Text>
      </TouchableOpacity>
    </View>
  );
};

InputWithMax.propTypes = {
  onChangeText: PropTypes.func.isRequired,
  maxValue: PropTypes.string.isRequired,
  style: PropTypes.object,
};

InputWithMax.defaultProps = {
  style: null,
};

export default InputWithMax;
