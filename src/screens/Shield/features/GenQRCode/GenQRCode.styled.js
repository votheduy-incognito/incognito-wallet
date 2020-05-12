import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  extra: {
    alignItems: 'center',
    flex: 1,
  },
  titleStyled: {
    textTransform: 'none',
  },
  text: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.lightGrey1,
    textAlign: 'center',
  },
  errorIcon: {
    color: COLORS.orange,
    fontSize: 60,
  },
  hook: {
    alignItems: 'center',
    marginTop: 40,
  },
  questionIcon: {
    marginBottom: 10,
  },
  qrCode: {
    marginVertical: 40,
  },
});
