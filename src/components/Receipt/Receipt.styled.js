import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  title: {
    fontFamily: FONT.NAME.bold,
    color: COLORS.black,
    fontSize: 35,
    lineHeight: 41,
    marginTop: 42,
    marginBottom: 25,
    textAlign: 'center',
  },
  divider: {
    marginVertical: 30,
  },
  backButton: {
    width: '100%',
    marginTop: 50,
  },
  titleBtn: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 3,
    color: COLORS.white,
  },
  hook: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 25,
  },
  label: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular - 1,
    lineHeight: FONT.SIZE.regular + 2,
    color: COLORS.colorGreyBold,
    flex: 1,
    textAlign: 'left',
    minWidth: 20,
  },
  desc: {
    flex: 5,
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.regular - 1,
    lineHeight: FONT.SIZE.regular + 2,
    color: COLORS.black,
  },
});
