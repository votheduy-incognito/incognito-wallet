import { COLORS, DECOR } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: DECOR.borderRadiusBorder,
    padding: 13
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
    fontWeight: '500'
  },
  subNameText: {
    fontSize: 14
  },
  amountText: {
    fontWeight: '500'
  }
});
