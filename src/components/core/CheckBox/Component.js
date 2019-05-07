import React from 'react';
import PropTypes from 'prop-types';
import { CheckBox as RNCheckBox } from 'react-native';
import { Text, View } from '@src/components/core';
import styleSheet from './style';

const CheckBox = ({ label, labelStyle, containerStyle, ...checkBoxProps }) => (
  <View style={[styleSheet.container, containerStyle]}>
    <RNCheckBox {...checkBoxProps}/>
    { label && <Text style={[styleSheet.label, labelStyle]}>{label}</Text> }
  </View>
);

CheckBox.propTypes = {
  label: PropTypes.string,
  labelStyle: PropTypes.object,
  containerStyle: PropTypes.object,
};

export default CheckBox;