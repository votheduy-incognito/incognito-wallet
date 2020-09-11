import {StyleSheet} from 'react-native';
import {COLORS, FONT} from '@src/styles';
import font from '@src/styles/font';
import { ScreenWidth } from '@src/utils/devices';

const style = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    flex: 1,
    paddingBottom: 10,
  },
  text: {
    color: COLORS.lightGrey1,
    lineHeight: 26,
    ...FONT.STYLE.normal,
  },
  title: {
    ...FONT.STYLE.bold,
    fontSize: FONT.SIZE.regular,
    marginTop: 30,
    lineHeight: 26,
  },
  titleHeader: {
    ...FONT.STYLE.bold,
    fontSize: font.SIZE.superMedium,
    marginTop: 30,
    lineHeight: 26,
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
  halfInput: {
    width: (ScreenWidth - 40) / 2 - 15,
  },
  error: {
    height: 24,
    color: COLORS.orange,
    ...FONT.STYLE.medium,
  },
  input: {
    fontSize: 18,
    flex: 1,
    height: 35,
    padding: 0,
    ...FONT.STYLE.bold,
  },
  placeholder: {
    ...FONT.STYLE.medium,
  },
  field: {
    marginBottom: 30,
  },
  content: {
    marginTop: 42,
  }
});

export default style;
