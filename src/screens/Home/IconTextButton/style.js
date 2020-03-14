import { COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  btn: {
    paddingVertical: 10,
    alignItems: 'center',
    height: 130,
  },
  image: {
    marginBottom: 5,
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 16,
    lineHeight: 34,
    color: COLORS.black,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: COLORS.lightGrey1,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});

export default style;
