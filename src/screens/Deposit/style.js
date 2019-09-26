import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
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
  }
});

export const waitingDepositStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80,
  },
  textContainer: {
    paddingHorizontal: 20,
  },
  text: {
    textAlign: 'center',
    color: COLORS.lightGrey3
  },
  textHighlight: {
    ...FONT.STYLE.medium,
    color: COLORS.dark1,
    marginBottom: 10,
  }
});