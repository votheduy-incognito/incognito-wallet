import { Text, View } from '@src/components/core';
import PropTypes from 'prop-types';
import React from 'react';
import { CheckBox as RNCheckBox } from 'react-native';
import styleSheet from './style';

const CheckBox = ({ label, labelStyle, containerStyle, ...checkBoxProps }) => (
  <View style={[styleSheet.container, containerStyle]}>
    <RNCheckBox {...checkBoxProps} />
    {label && <Text style={[styleSheet.label, labelStyle]}>{label}</Text>}
  </View>
);

CheckBox.propTypes = {
  label: PropTypes.string,
  labelStyle: PropTypes.objectOf(PropTypes.object),
  containerStyle: PropTypes.objectOf(PropTypes.object)
};

export default CheckBox;
