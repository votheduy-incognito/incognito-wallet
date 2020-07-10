import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';

const styles = StyleSheet.create({
  dialog: {
    margin: 25,
    position: 'relative',
    borderRadius: 13,
  },
  hook: {
    marginVertical: 50,
  },
  title: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 5,
    color: COLORS.black,
    textAlign: 'center',
    marginBottom: 15,
  },
  desc: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 5,
    color: COLORS.colorGreyBold,
    textAlign: 'center',
  },
  btnClose: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default styles;
