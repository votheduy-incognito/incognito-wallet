import { Dimensions, Platform, StatusBar, StyleSheet } from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import colors from './colors';

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 20;

export const screenSize = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height - STATUSBAR_HEIGHT
};

export const FONT_FAMILY = Platform.OS === 'ios' ? 'Roboto' : 'Roboto';
const textColor = colors.white;
const TextStyle = StyleSheet.create({
  bigText: {
    fontFamily: FONT_FAMILY,
    fontSize: verticalScale(18)
    // fontSize: 18 * scale()
  },
  button: {
    alignItems: 'center',
    borderRadius: 5,
    height: 42,
    justifyContent: 'center',
    padding: 7
  },
  buttonText: {
    color: textColor,
    fontFamily: FONT_FAMILY,
    fontSize: verticalScale(16)
  },
  extraText: {
    color: textColor,
    fontFamily: FONT_FAMILY,
    fontSize: verticalScale(22)
  },
  mediumText: {
    color: textColor,
    fontFamily: FONT_FAMILY,
    fontSize: verticalScale(16)
    // lineHeight: verticalScale(14)
  },

  minimizeText: {
    color: textColor,
    fontFamily: FONT_FAMILY,
    fontSize: verticalScale(7)
  },
  normalText: {
    color: textColor,
    fontFamily: FONT_FAMILY,
    fontSize: verticalScale(12)
  },
  smallText: {
    color: textColor,
    fontFamily: FONT_FAMILY,
    fontSize: verticalScale(10)
  },
  xExtraText: {
    color: textColor,
    fontFamily: FONT_FAMILY,
    fontSize: verticalScale(26)
  },
  xxExtraText: {
    color: textColor,
    fontFamily: FONT_FAMILY,
    fontSize: verticalScale(30)
  },
  xxxExtraText: {
    color: textColor,
    fontFamily: FONT_FAMILY,
    fontSize: verticalScale(60),
    lineHeight: verticalScale(60)
  }
});
export default TextStyle;
