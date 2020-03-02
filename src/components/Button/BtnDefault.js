import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import PropTypes from 'prop-types';
import {FONT} from '@src/styles';

const styled = StyleSheet.create({
  title: {
    color: '#fff',
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular + 2,
  },
  btnStyle: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#25CDD6',
    borderRadius: 4,
  },
});

const BtnLinear = props => {
  const {title, titleStyle, btnStyle, ...rest} = props;
  return (
    <TouchableOpacity style={[styled.btnStyle, btnStyle]} {...rest}>
      <Text
        style={[styled.title, titleStyle]}
        ellipsizeMode="middle"
        numberOfLines={1}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

BtnLinear.defaultProps = {
  title: '',
  titleStyle: {},
  btnStyle: {},
};

BtnLinear.propTypes = {
  title: PropTypes.string,
  titleStyle: PropTypes.any,
  btnStyle: PropTypes.any,
};

export default BtnLinear;
