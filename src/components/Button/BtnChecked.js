import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { CheckedIcon } from '@src/components/Icons';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  btnStyle: {},
});

const BtnBack = (props) => {
  const { btnStyle, checked, hook, ...rest } = props;
  return (
    <TouchableOpacity style={[styled.btnStyle, btnStyle]} {...rest}>
      <CheckedIcon checked={checked} />
      {hook}
    </TouchableOpacity>
  );
};

BtnBack.defaultProps = {
  btnStyle: null,
  hook: null,
};

BtnBack.propTypes = {
  btnStyle: PropTypes.any,
  checked: PropTypes.bool.isRequired,
  hook: PropTypes.element,
};

export default BtnBack;
