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
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    color: COLORS.colorGreyBold,
    textAlign: 'center',
  },
  boldText: {
    fontFamily: FONT.NAME.bold,
    color: COLORS.black,
  },
  errorIcon: {
    color: COLORS.orange,
    fontSize: 60,
  },
  hook: {
    alignItems: 'center',
    marginBottom: 30,
  },
  questionIcon: {
    marginBottom: 10,
  },
  qrCode: {
    marginVertical: 30,
  },
  clockIcon: {
    width: 40,
    height: 40,
  },
  title: {
    color: COLORS.black,
  },
  scrollview: {
    marginTop: 42,
  },
  countdown: {
    paddingHorizontal: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: FONT.NAME.medium,
    lineHeight: FONT.SIZE.regular + 5,
    fontSize: FONT.SIZE.regular,
    color: COLORS.colorGreyBold,
    textAlign: 'center',
    marginTop: 15,
  },
  btnRetry: {
    width: '100%',
    marginVertical: 50,
  },
  titleBtnRetry: {
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 3,
  },
});
