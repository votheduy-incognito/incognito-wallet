import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  errorText: {
    fontFamily: FONT.NAME.regular,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 10,
    color: COLORS.orange,
  },
  field: {
    marginBottom: 5,
  },
});
