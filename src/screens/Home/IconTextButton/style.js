import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  btn: {
    paddingVertical: 8,
    alignItems: 'center',
    height: 110,
  },
  image: {
    marginBottom: 3,
    height: 50,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 15,
    lineHeight: 30,
    color: COLORS.black,
    fontFamily: FONT.NAME.regular,
    textAlign: 'center',
  },
  desc: {
    fontSize: 15,
    color: COLORS.lightGrey1,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});

export default style;
