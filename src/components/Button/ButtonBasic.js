import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, FONT } from '@src/styles';
import { TouchableOpacity } from '@src/components/core';

const styled = StyleSheet.create({
  container: {
    backgroundColor: COLORS.colorPrimary,
    borderRadius: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  title: {
    color: COLORS.white,
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 3,
  },
  disabled: {
    backgroundColor: COLORS.colorGreyMedium,
  },
  disabledPress: {
    opacity: 0.5
  },
});

const ButtonBasic = (props) => {
  const {
    title = '',
    btnStyle = null,
    titleStyle = null,
    customContent,
    disabled = false,
    disabledPress,
    ...rest
  } = props;

  return (
    <View style={[styled.container, btnStyle, disabledPress && styled.disabledPress]}>
      <TouchableOpacity
        style={[styled.container, btnStyle, disabled ? styled.disabled : null]}
        {...rest}
      >
        {customContent ? (
          customContent
        ) : (
          <Text style={[styled.title, titleStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

ButtonBasic.propTypes = {
  title: PropTypes.string,
  btnStyle: PropTypes.any,
  titleStyle: PropTypes.any,
  customContent: PropTypes.element,
  disabled: PropTypes.bool,
  disabledPress: PropTypes.bool,
};

ButtonBasic.defaultProps = {
  title: '',
  btnStyle: null,
  titleStyle: null,
  customContent: null,
  disabled: false,
  disabledPress: false,
};

export default ButtonBasic;
