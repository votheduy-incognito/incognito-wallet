import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { Platform, StatusBar as RNComponent, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const whiteScreens = ['Game', 'pApps', 'GetStarted'];
const blue2Screens = [];
const blue1Screens = ['Wizard','HomeMine','DetailDevice'];
const dark2Screen = ['Dex', 'DexHistory', 'DexHistoryDetail'];

const isIOS = Platform.OS === 'ios';
const isIphoneX = DeviceInfo.hasNotch();

const STATUS_BAR_HEIGHT = isIOS ? isIphoneX ? 40 : 20 : RNComponent.currentHeight;

const StatusBar = React.memo(({ currentScreen }) => {
  let backgroundColor;
  let textColor;

  if (whiteScreens.includes(currentScreen)) {
    backgroundColor = COLORS.white;
    textColor = 'dark-content';
  } else if (blue2Screens.includes(currentScreen)) {
    backgroundColor = COLORS.blue2;
    textColor = 'light-content';
  } else if (blue1Screens.includes(currentScreen)) {
    backgroundColor = COLORS.blue1;
    textColor = 'light-content';
  } else if (dark2Screen.includes(currentScreen)) {
    backgroundColor = COLORS.dark2;
    textColor = 'light-content';
  } else {
    backgroundColor = COLORS.dark4;
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
      backgroundColor: backgroundColor,
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
