import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export default StyleSheet.create({
  input: {
    paddingHorizontal: 0,
  },
  button: {
    marginTop: 50,
  },
  error: {
    color: COLORS.orange,
    fontSize: 14,
  },
  inputStyle: {
    ...FONT.STYLE.medium,
    color: COLORS.newGrey,
    fontSize: 20,
    marginTop: 10,
  },
});

