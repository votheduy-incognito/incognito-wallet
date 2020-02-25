import {COLORS, FONT} from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    textAlign: 'right',
    height: 54,
  },
  textContainer: {
    flexDirection: 'row',
    marginRight: -15,
  },
  title: {
    fontSize: 18,
    color: COLORS.white,
    ...FONT.STYLE.bold,
    textAlign: 'right',
    width: 200,
    marginRight: 10,
  }
});

export default style;
