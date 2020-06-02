import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  hook: {
    flex: 1,
    marginLeft: 20,
  },
  image: {
    height: 55,
    width: 55,
    resizeMode: 'contain',
  },
  title: {
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 3,
    fontFamily: FONT.NAME.bold,
    color: COLORS.black,
    marginBottom: 5,
  },
  desc: {
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 3,
    fontFamily: FONT.NAME.medium,
    color: COLORS.colorGreyBold,
  },
  disabled: {
    opacity: 0.4,
  },
});
