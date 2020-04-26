import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ThreeDotsVerIcon} from '@src/components/Icons';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  btnStyle: {
    height: 32,
    justifyContent: 'center',
  },
});

const BtnThreeDotsVer = props => {
  const {btnStyle} = props;
  return (
    <TouchableOpacity style={[styled.btnStyle, btnStyle]} {...props}>
      <ThreeDotsVerIcon />
    </TouchableOpacity>
  );
};

BtnThreeDotsVer.defaultProps = {
  btnStyle: null,
};

BtnThreeDotsVer.propTypes = {
  btnStyle: PropTypes.any,
};
export default BtnThreeDotsVer;
