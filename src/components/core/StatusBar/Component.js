import React from 'react';
import PropTypes from 'prop-types';
import {StatusBar as RNComponent, View, Platform} from 'react-native';
import {THEME} from '@src/styles';

const whiteScreens = ['HomeMine', 'Game'];
const darkScreens = ['DetailDevice'];

const isIOS = Platform.OS === 'ios';
const STATUS_BAR_HEIGHT = isIOS ? 20 : RNComponent.currentHeight;

const StatusBar = React.memo(({ currentScreen }) => {
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

  if (!isIOS) {
    RNComponent.setBackgroundColor(backgroundColor);
    RNComponent.setBarStyle(textColor);
    return null;
  }

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
});

StatusBar.defaultProps = {
  currentScreen: '',
};

StatusBar.propTypes = {
  currentScreen: PropTypes.string,
};

export default StatusBar;
