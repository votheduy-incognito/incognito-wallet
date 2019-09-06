import {Platform} from 'react-native';

const FONT_FAMILY = Platform.OS === 'ios' ? 'PostGrotesk' : 'PostGrotesk';
const fontNames =  {
  default: Platform.OS === 'ios'?`${FONT_FAMILY}-Light`: `${FONT_FAMILY}Light`,
  italic: Platform.OS === 'ios'?`${FONT_FAMILY}-LightItalic`:`${FONT_FAMILY}LightItalic`,
  medium: Platform.OS === 'ios'?`${FONT_FAMILY}-Medium`:`${FONT_FAMILY}Medium`,
  mediumItalic: Platform.OS === 'ios'?`${FONT_FAMILY}-MediumItalic`:`${FONT_FAMILY}MediumItalic`,
  bold: Platform.OS === 'ios'?`${FONT_FAMILY}-Bold`:`${FONT_FAMILY}Bold`,
  boldItalic: Platform.OS === 'ios'?`${FONT_FAMILY}-BoldItalic`:`${FONT_FAMILY}BoldItalic`,
  regular: Platform.OS === 'ios'?`${FONT_FAMILY}-Book`:`${FONT_FAMILY}Book`,
  regularItalic: Platform.OS === 'ios'?`${FONT_FAMILY}-BookItalic`:`${FONT_FAMILY}BookItalic`,
};

const fontStyle = {
  normal: {
    fontFamily: fontNames.regular,
  },
  medium: {
    fontFamily: fontNames.medium,
  },
  bold: {
    fontFamily: fontNames.bold,
  },
  light: {
    fontFamily: fontNames.light,
  }
};

const fontSizes =  {
  superSmall: 12,
  small: 14,
  regular: 16,
  medium: 18,
  large: 22,
  superLarge: 30,
};

export default {
  NAME: fontNames,
  SIZE: fontSizes,
  STYLE: fontStyle
};