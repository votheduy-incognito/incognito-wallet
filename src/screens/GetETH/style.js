import {StyleSheet} from 'react-native';
import {COLORS, FONT} from '@src/styles';

const style = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  text: {
    color: COLORS.lightGrey1,
  },
  title: {
    ...FONT.STYLE.bold,
    marginTop: 20,
    lineHeight: 26,
  },
  bold: {
    color: COLORS.lightGrey1,
    ...FONT.STYLE.bold,
  },
  paddingBottom: {
    paddingBottom: 20,
  },
  link: {
    color: COLORS.primary,
  },
});

export default style;
