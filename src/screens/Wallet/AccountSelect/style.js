import {COLORS, FONT} from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    height: 54,
  },
  toggle: {
    width: 200,
    justifyContent: 'flex-start',
  },
  textContainer: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    color: COLORS.white,
    ...FONT.STYLE.bold,
  },
  item: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  }
});

export default style;
