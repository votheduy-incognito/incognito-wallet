import { StyleSheet } from 'react-native';
import { COLORS, THEME } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    flex: 1,
  },
  currentBalanceContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 50,
  },
  currentBalance: {
    ...THEME.text.defaultTextStyle,
    fontSize: 28,
    color: COLORS.black1,
    letterSpacing: 0,
    textAlign: 'center',
  },
  currentBalanceLabel: {
    ...THEME.text.defaultTextStyle,
    fontSize: 16,
    color: '#899092',
  },
  feeText: {
    textAlign: 'right',
    marginVertical: 10,
  },
  form: {
    marginTop: 30,
    width: '100%'
  },
  submitBtn: {
    marginTop: 30
  },
});