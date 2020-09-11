import {StyleSheet} from 'react-native';
import {COLORS, FONT} from '@src/styles';
import { isAndroid } from '@utils/platform';

const style = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
  },
  text: {
    color: COLORS.newGrey,
    lineHeight: isAndroid() ? 30 : 25,
    ...FONT.STYLE.medium,
  },
  textLine: {
    color: COLORS.newGrey,
    lineHeight: 26,
    width: '90%',
    ...FONT.STYLE.medium,
  },
  title: {
    ...FONT.STYLE.bold,
    marginTop: 30,
    fontSize: FONT.SIZE.medium,
    marginBottom: 10,
  },
  bold: {
    ...FONT.STYLE.bold,
  },
  semiBold: {
    ...FONT.STYLE.bold,
    color: COLORS.lightGrey1,
  },
  marginTop: {
    marginTop: 25,
  },
});

export default style;
