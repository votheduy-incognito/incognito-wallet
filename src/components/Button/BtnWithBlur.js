import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, FONT } from '@src/styles';

const styled = StyleSheet.create({
  btnStyle: {
    height: 40,
    minWidth: 75,
    padding: 16,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 20,
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey19
  },
  text: {
    ...FONT.STYLE.medium,
    fontSize: 15,
    color: COLORS.black,
  }
});

const BtnWithBlur = props => {
  const {btnStyle, text} = props;
  return (
    <TouchableOpacity style={[styled.btnStyle, btnStyle]} {...props}>
      <Text style={styled.text}>{text || ''}</Text>
    </TouchableOpacity>
  );
};

BtnWithBlur.defaultProps = {
  btnStyle: null,
};

BtnWithBlur.propTypes = {
  btnStyle: PropTypes.any,
};
export default BtnWithBlur;
