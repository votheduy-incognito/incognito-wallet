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
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  text: {
    color: COLORS.white,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 10,
    textAlign: 'center',
    width: '50%',
  },
  title: {
    marginTop: 20,
  },
  desc: {
    marginTop: 20,
  },
});

const LoadingModal = props => {
  const {title, desc} = props;
  return (
    <View style={styled.container}>
      <ActivityIndicator />
      {title && <Text style={[styled.text, styled.title]}>{title}</Text>}
      {desc && <Text style={[styled.text, styled.desc]}>{desc}</Text>}
    </View>
  );
};

LoadingModal.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};

export default LoadingModal;
