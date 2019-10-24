/* eslint-disable */
import PropTypes from 'prop-types';
import React from 'react';
import { View, Picker, Platform, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import styleSheet from './style';

const isIOS = Platform.OS === 'ios';
const RNComponent = isIOS ? RNPickerSelect : Picker;

const Select = ({ containerStyle, inputStyle, style, prependView, label, ...props }) => {
  return (
    <View style={[styleSheet.container, style]}>
      {label && <Text style={[styleSheet.label]}>{label}</Text>}
      <View
        style={[
          styleSheet.row,
          containerStyle,
        ]}
      >
        <RNComponent
          {...props}
          children={isIOS ? null : props.children}
          style={[
            styleSheet.input,
            inputStyle,
          ]}
        />
        {prependView}
      </View>
    </View>
  );
};

Select.defaultProps = {
  label: null,
  containerStyle: null,
  inputStyle: null,
  prependView: null,
  style: null,
};

Select.propTypes = {
  containerStyle: PropTypes.object,
  inputStyle: PropTypes.object,
  prependView: PropTypes.element,
  label: PropTypes.string,
  style: PropTypes.shape({}),
};

export default Select;
