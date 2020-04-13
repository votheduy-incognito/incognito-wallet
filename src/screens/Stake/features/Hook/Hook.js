import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {FONT, COLORS} from '@src/styles';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  hook: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  leftText: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.lightGrey1,
  },
  rightText: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.black,
  },
});

export const Hook = ({data}) => {
  const {leftText, rightText, disabled} = data;
  if (disabled) {
    return null;
  }
  return (
    <View style={styled.hook}>
      <Text style={styled.leftText}>{leftText}</Text>
      <Text style={styled.rightText}>{rightText}</Text>
    </View>
  );
};

Hook.defaultProps = {
  data: {
    leftText: '',
    rightText: '',
    disabled: false,
  },
};

Hook.propTypes = {
  data: PropTypes.shape({
    leftText: PropTypes.string,
    rightText: PropTypes.string,
    disabled: PropTypes.bool,
  }),
};
export default Hook;
