import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export default StyleSheet.create({
  input: {
    ...FONT.STYLE.normal,
    color: COLORS.black,
    flex: 1,
    paddingVertical: 0,
  },
});
