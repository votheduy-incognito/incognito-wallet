import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  desc: {
    ...FONT.STYLE.medium,
    marginBottom: 20,
    textAlign: 'center'
  },
  submitBtn: {
    marginTop: 30
  },
  errorContainer: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    color: COLORS.orange,
    fontSize: 60,
  },
  errorText: {
    maxWidth: 400,
    textAlign: 'center',
  },
  errorText2: {
    marginTop: 5,
    maxWidth: 500,
    textAlign: 'center',
  },
});

export const waitingDepositStyle = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: 20,
  },
  textContainer: {
    paddingHorizontal: 20,
  },
  text: {
    textAlign: 'center',
    color: COLORS.lightGrey1,
    fontSize: 14,
    lineHeight: 18,
  },
  textHighlight: {
    ...FONT.STYLE.medium,
    color: COLORS.dark1,
    fontSize: 14,
    lineHeight: 23,
  }
});
