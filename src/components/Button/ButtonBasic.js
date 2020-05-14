import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, FONT } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    backgroundColor: '#33373A',
    borderRadius: 20,
    padding: 10,
  },
  title: {
    color: COLORS.white,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular - 1,
  },
});

const ButtonBasic = props => {
  const {
    title = '',
    btnStyle = null,
    titleStyle = null,
    customContent,
    ...rest
  } = props;
  return (
    <TouchableWithoutFeedback {...rest}>
      <View style={[styled.container, btnStyle]}>
        {customContent ? (
          customContent
        ) : (
          <Text style={[styled.title, titleStyle]}>{title}</Text>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

ButtonBasic.propTypes = {
  title: PropTypes.string,
  btnStyle: PropTypes.any,
  titleStyle: PropTypes.any,
  customContent: PropTypes.element,
};

export default ButtonBasic;
