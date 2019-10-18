import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export const homeStyle = StyleSheet.create({
  container: {
  },
  mainContainer: {
    flex: 1,
  },
  form: {
  },
  submitBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 6,
    textAlign: 'center',
  },
  submitBtnText: {
    ...FONT.STYLE.medium,
    color: COLORS.white,
    textAlign: 'center',
  },
  feeText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14
  },
  input: {
    marginBottom: 15
  }
});
