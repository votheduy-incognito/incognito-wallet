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
    textAlign: 'left',
  },
  rightText: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.black,
    textAlign: 'right',
    marginLeft: 'auto',
  },
});

export const Hook = ({data}) => {
  const {leftText, rightText, disabled, leftTextStyle, rightTextStyle} = data;
  if (disabled) {
    return null;
  }
  return (
    <View style={styled.hook}>
      <Text style={[styled.leftText, leftTextStyle]}>{leftText}</Text>
      <Text style={[styled.rightText, rightTextStyle]} numberOfLines={1}>
        {rightText}
      </Text>
    </View>
  );
};

Hook.defaultProps = {
  data: {
    leftText: '',
    rightText: '',
    disabled: false,
    leftTextStyle: null,
    rightTextStyle: null,
  },
};

Hook.propTypes = {
  data: PropTypes.shape({
    leftText: PropTypes.string,
    rightText: PropTypes.string,
    disabled: PropTypes.bool,
    leftTextStyle: PropTypes.any,
    rightTextStyle: PropTypes.any,
  }),
};
export default Hook;
