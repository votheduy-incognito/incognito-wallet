import { COLORS, DECOR, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: DECOR.borderRadiusBorder,
    shadowOffset: { width: 2, height: 0 },
    elevation: 3,
    padding: 13
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logo: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  },
  cryptoNameContainer: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  balanceContainer: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  text: {},
  mainNameText: {
    ...THEME.text.defaultTextStyle,
    fontWeight: '400'
  },
  subNameText: {
    ...THEME.text.defaultTextStyle,
    color: COLORS.lightGrey3,
    fontSize: 14,
  },
  amountText: {

  },
  getAmountFailedText: {
    color: COLORS.lightGrey3
  }
});
