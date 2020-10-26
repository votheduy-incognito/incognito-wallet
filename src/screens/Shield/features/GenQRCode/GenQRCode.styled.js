import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  extra: {
    alignItems: 'center',
  },
  titleStyled: {
    textTransform: 'none',
  },
  text: {
    fontFamily: FONT.NAME.regular,
    lineHeight: FONT.SIZE.regular + 9,
    fontSize: FONT.SIZE.regular,
    color: COLORS.colorGreyBold,
    textAlign: 'center',
  },
  boldText: {
    fontFamily: FONT.NAME.bold,
    color: COLORS.black,
  },
  smallText: {
    fontSize: 13,
    lineHeight: 15,
    marginTop: 5,
    color: COLORS.colorGreyBold,
    fontFamily: FONT.NAME.bold,
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
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 7,
  },
  scrollview: {
    paddingTop: 42,
  },
  countdown: {
    paddingHorizontal: 10,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 42,
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
    marginTop: 50,
  },
  titleBtnRetry: {
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 3,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  textContent: {
    fontFamily: FONT.NAME.medium,
    lineHeight: FONT.SIZE.regular + 3,
    fontSize: FONT.SIZE.regular,
    color: COLORS.white,
    textAlign: 'center',
  },
});
