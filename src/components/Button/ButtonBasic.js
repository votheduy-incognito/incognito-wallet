import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, FONT } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black,
    borderRadius: 10,
    padding: 10,
  },
  title: {
    color: COLORS.white,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
  },
});

const ButtonBasic = props => {
  const { title, btnStyle, titleStyle, ...rest } = props;
  return (
    <TouchableWithoutFeedback {...rest}>
      <View style={[styled.container, btnStyle]}>
        <Text style={[styled.title, titleStyle]}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

ButtonBasic.defaultProps = {
  btnStyle: null,
  titleStyle: null,
};

ButtonBasic.propTypes = {
  title: PropTypes.string.isRequired,
  btnStyle: PropTypes.any,
  titleStyle: PropTypes.any,
};

export default ButtonBasic;
