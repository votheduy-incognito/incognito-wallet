import { StyleSheet } from 'react-native';
import { COLORS, FONT, DECOR, UTILS } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.blue1,
    width: UTILS.deviceWidth(),
  },
  baseContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginTop: 10
  },
  title: {
    ...FONT.STYLE.medium,
    maxWidth: 310,
    fontSize: 32,
    lineHeight: 43,
    color: COLORS.white,
    textAlign: 'center',
    marginVertical: 20
  },
  desc: {
    maxWidth: 300,
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 30
  },
  image: {
    width: '100%',
    flex: 1,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  button: {},
  buttonText: {},
  buttonLight: {
    borderColor: COLORS.white,
    borderRadius: 4,
    borderWidth: DECOR.borderWidth,
    backgroundColor: COLORS.transparent
  },
  buttonFinish: {},
  indicator: {
    marginBottom: 30
  },
  indicatorContainer: {
    flexDirection: 'row'
  },
  indicatorItem: {
    color: COLORS.white,
    fontSize: 9,
    marginHorizontal: 2
  }
});