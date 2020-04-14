import {StyleSheet} from 'react-native';
import {COLORS, FONT} from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  wrapper: {
    flex: 1,
    padding: 20,
    margin: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  specialBg: {
    backgroundColor: COLORS.dark4,
    width: '100%',
    height: 100,
    left: 0,
    top: -60,
    position: 'absolute',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  bgStake: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'center',
  },
  hook: {
    alignItems: 'center',
  },
  desc: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.large,
    lineHeight: FONT.SIZE.large + 6,
    color: COLORS.black,
    marginRight: 5,
  },
  title: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.lightGrey1,
  },
  balanceContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  balance: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.superLarge + 5,
    lineHeight: FONT.SIZE.superLarge + 10,
    color: COLORS.black,
    marginTop: 10,
  },
  symbol: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.black,
  },
  btnStake: {
    marginTop: 25,
  },
  arrow: {
    justifyContent: 'center',
  },
  background: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // or 'stretch'
    position: 'absolute',
    flex: 1,
  },
  interestRateContainer: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
