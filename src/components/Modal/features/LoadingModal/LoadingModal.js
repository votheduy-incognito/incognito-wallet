import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {ActivityIndicator} from '@src/components/core';
import {COLORS, FONT} from '@src/styles';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: COLORS.white,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    textAlign: 'center',
    width: '90%',
    marginTop: 20,
  },
});

const LoadingModal = props => {
  const {title} = props;
  return (
    <View style={styled.container}>
      <ActivityIndicator />
      <Text style={styled.title}>{title}</Text>
    </View>
  );
};

LoadingModal.defaultProps = {
  title: 'Please wait a moment...',
};

LoadingModal.propTypes = {
  title: PropTypes.string,
};

export default LoadingModal;
