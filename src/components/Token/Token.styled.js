import { StyleSheet } from 'react-native';
import { FONT, COLORS, UTILS } from '@src/styles';
import { isIOS } from '@src/utils/platform';

export const styled = StyleSheet.create({
  container: {
    paddingVertical: 15,
  },
  extra: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  extraTop: {
    marginBottom: isIOS() ? 10 : 5,
  },
  name: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    maxWidth: '60%',
  },
  leftText: {
    textAlign: 'left',
  },
  rightText: {
    textAlign: 'right',
  },
  boldText: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    color: COLORS.black,
  },
  displayName: {
    maxWidth: '80%',
  },
  text: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.superMedium,
    color: COLORS.colorGreyBold,
    maxWidth: UTILS.screenWidth() / 2 - 30,
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  priceContainer: {
    flexDirection: 'row',
  },
  pSymbol: {
    fontFamily: FONT.NAME.specialRegular,
    fontSize: FONT.SIZE.medium,
    color: COLORS.colorGreyBold,
    lineHeight: FONT.SIZE.medium + 3,
  },
  pSymbolBold: {
    fontFamily: FONT.NAME.specialRegular,
    fontSize: FONT.SIZE.superMedium,
    color: COLORS.black,
    lineHeight: FONT.SIZE.superMedium + 3,
  },
  redText: {
    color: COLORS.red,
  },
  greenText: {
    color: COLORS.green,
  },
  bottomText: {
    fontSize: FONT.SIZE.medium,
  },
  normalText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
