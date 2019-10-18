import React from 'react';
import PropTypes from 'prop-types';
import {StatusBar as RNComponent, View, Platform} from 'react-native';
import {THEME} from '@src/styles';

const whiteScreens = ['HomeMine', 'Game'];
const darkScreens = ['DetailDevice'];

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 20 : RNComponent.currentHeight;

const StatusBar = ({ currentScreen }) => {
  let backgroundColor;
  let textColor;

  console.debug(whiteScreens, whiteScreens.includes(currentScreen));

  if (whiteScreens.includes(currentScreen)) {
    backgroundColor = THEME.statusBar.backgroundColor2;
    textColor = 'dark-content';
  } else if (darkScreens.includes(currentScreen)) {
    backgroundColor = THEME.statusBar.backgroundColor3;
    textColor = 'light-content';
  } else {
    backgroundColor = THEME.statusBar.backgroundColor1;
    textColor = 'light-content';
  }

  console.debug('color', backgroundColor, currentScreen);

  return (
    <View style={{
      width: '100%',
      height: STATUS_BAR_HEIGHT,
      backgroundColor: backgroundColor
    }}
    >
      <RNComponent barStyle={textColor} />
    </View>
  );
};

StatusBar.defaultProps = {
  currentScreen: '',
};

StatusBar.propTypes = {
  currentScreen: PropTypes.string,
};

export default StatusBar;
