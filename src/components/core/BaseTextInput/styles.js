import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export default StyleSheet.create({
  input: {
    ...FONT.STYLE.normal,
    color: COLORS.dark1,
    flex: 1,
    paddingVertical: 0,
  },
});
