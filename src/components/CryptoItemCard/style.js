import { COLORS, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
    borderBottomColor: COLORS.lightGrey6,
    borderBottomWidth: 1,
  },
  logoContainer: {
    paddingRight: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cryptoNameContainer: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  text: {},
  mainNameText: {
    ...THEME.text.defaultTextStyle,
    fontWeight: '400',
  },
  subNameText: {
    ...THEME.text.defaultTextStyle,
    color: COLORS.lightGrey1,
    fontSize: 14,
    marginTop: 3
  },
  amountText: {

  },
  getAmountFailedText: {
    color: COLORS.lightGrey3
  }
});
