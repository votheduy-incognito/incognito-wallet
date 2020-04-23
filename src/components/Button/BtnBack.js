import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {BackIcon} from '@src/components/Icons';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  btnStyle: {
    width: 32,
    height: 32,
    justifyContent: 'center',
  },
});

const BtnBack = props => {
  const {btnStyle} = props;
  return (
    <TouchableOpacity style={[styled.btnStyle, btnStyle]} {...props}>
      <BackIcon />
    </TouchableOpacity>
  );
};

BtnBack.defaultProps = {
  btnStyle: null,
};

BtnBack.propTypes = {
  btnStyle: PropTypes.any,
};

export default BtnBack;
