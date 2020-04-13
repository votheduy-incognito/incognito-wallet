import React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {STATUS_BAR_HEIGHT} from './Component';

const styled = StyleSheet.create({
  container: {
    width: '100%',
    height: STATUS_BAR_HEIGHT,
  },
});

const StatusBarLinear = props => {
  return (
    <LinearGradient
      colors={['#E8E8E8', '#F7EAD5', '#C5D1E0', '#F6F6F6', '#EAFBFB']}
      style={styled.container}
      useAngle
      angle={90}
      angleCenter={{x: 0.5, y: 0.5}}
    >
      <StatusBar barStyle="default" />
    </LinearGradient>
  );
};

StatusBarLinear.propTypes = {};

export default StatusBarLinear;
