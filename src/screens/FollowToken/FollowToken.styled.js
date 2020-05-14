import { StyleSheet } from 'react-native';
import { FONT, COLORS, UTILS } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  listToken: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
  },
});
