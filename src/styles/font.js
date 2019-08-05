import {Platform} from 'react-native';

const fontNames =  {
  default: Platform.OS === 'ios'?'PostGrotesk-Light': 'PostGroteskLight',
  italic: Platform.OS === 'ios'?'PostGrotesk-LightItalic':'PostGroteskLightItalic',
  medium: Platform.OS === 'ios'?'PostGrotesk-Medium':'PostGroteskMedium',
  mediumItalic: Platform.OS === 'ios'?'PostGrotesk-MediumItalic':'PostGroteskMediumItalic',
  bold: Platform.OS === 'ios'?'PostGrotesk-Bold':'PostGroteskBold',
  boldItalic: Platform.OS === 'ios'?'PostGrotesk-BoldItalic':'PostGroteskBoldItalic',
  regular: Platform.OS === 'ios'?'PostGrotesk-Book':'PostGroteskBook',
  regularItalic: Platform.OS === 'ios'?'PostGrotesk-BookItalic':'PostGroteskBookItalic',
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