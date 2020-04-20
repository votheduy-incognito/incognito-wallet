import {COLORS, FONT} from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    height: 54,
    alignSelf: 'center',
  },
  toggle: {
    width: 200,
    justifyContent: 'flex-start',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: COLORS.white,
    fontFamily: FONT.NAME.medium,
    marginEnd: 5,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  }
});

export default style;
