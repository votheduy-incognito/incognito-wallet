import { StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONT } from '@src/styles';
import { verticalScale } from 'react-native-size-matters';

export default StyleSheet.create({
  container: {
    paddingBottom: verticalScale(80),
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginBottom: 30,
  },
  title: {
    ...FONT.STYLE.bold,
    color: COLORS.black,
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    ...FONT.STYLE.medium,
    color: COLORS.newGrey,
    fontSize: 16,
    textAlign: 'center',
  },
});
