import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export const styledHeaderTitle = StyleSheet.create({
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.black,
    marginRight: 'auto',
    textTransform: 'capitalize',
  },
  searchStyled: {
    textTransform: 'none',
    color: COLORS.lightGrey2,
  },
});
