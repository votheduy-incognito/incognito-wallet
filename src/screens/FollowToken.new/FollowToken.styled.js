import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';

export const styled = StyleSheet.create({
  container: {},
  flatList: {},
  text: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.lightGrey1,
  },
  boldText: {
    fontFamily: FONT.NAME.medium,
    color: COLORS.black,
  },
  addManually: {},
});
