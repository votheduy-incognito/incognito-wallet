const fontNames =  {
  default: 'PostGroteskLight',
  italic: 'PostGroteskLightItalic',
  medium: 'PostGroteskMedium',
  mediumItalic: 'PostGroteskMediumItalic',
  bold: 'PostGroteskBold',
  boldItalic: 'PostGroteskBoldItalic',
  regular: 'PostGroteskBook',
  regularItalic: 'PostGroteskBookItalic',
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