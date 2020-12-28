import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  defaultTextStyle: {
    fontSize: FONT.SIZE.superMedium,
    lineHeight: 24,
  },

  slippageStyle: {
    ...FONT.STYLE.medium,
    flex: 1,
    color: COLORS.lightGrey17,
  },
  unitSlippageStyle: {
    ...FONT.STYLE.medium,
    color: COLORS.black,
  },
  errorStyle: {
    ...FONT.STYLE.medium,
    fontSize: 13,
    color: COLORS.orange,
    marginTop: 10
  }
});