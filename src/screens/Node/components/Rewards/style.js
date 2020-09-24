import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

const style = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    marginTop: 20,
    borderRadius: 3,
    backgroundColor: COLORS.lightGrey5,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 20,
    backgroundColor: COLORS.black,
  },
  balanceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  balanceUpdate: {
    fontSize: FONT.SIZE.superLarge,
    color: COLORS.black,
    textAlign: 'center',
    ...FONT.STYLE.bold,
  },
  rewards: {
    width: '100%',
    height: 70,
    marginTop: 42,
  },
  noDot: {
    marginBottom: 30,
  },
  haveDot: {
    marginBottom: 50,
  }
});

export default style;
