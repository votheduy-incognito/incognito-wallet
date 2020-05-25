import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    paddingBottom: 8,
  },
});

export const styledHeaderTitle = StyleSheet.create({
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.black,
    marginRight: 'auto',
    maxWidth: '50%',
  },
  searchStyled: {
    textTransform: 'none',
    color: COLORS.colorGreyMedium,
    maxWidth: '100%',
  },
});
