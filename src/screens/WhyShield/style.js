import {StyleSheet} from 'react-native';
import {COLORS, FONT} from '@src/styles';

const style = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingVertical: 35,
  },
  text: {
    color: COLORS.lightGrey1,
    lineHeight: 26,
  },
  title: {
    ...FONT.STYLE.bold,
    marginTop: 30,
    lineHeight: 26,
  },
});

export default style;
