import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export default StyleSheet.create({
  extra: {
    color: COLORS.lightGrey17,
    ...FONT.STYLE.medium,
  },
  row: {
    flexDirection: 'row'
  },
});
