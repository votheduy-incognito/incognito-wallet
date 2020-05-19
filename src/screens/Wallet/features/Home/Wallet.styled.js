import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  groupButtonContainer: {
    marginTop: 50,
    marginBottom: 35,
  },
  groupButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnStyle: {
    width: '100%',
    maxWidth: '49%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    padding: 13,
  },
  titleStyle: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
  },
  themeBtnStyle: {
    backgroundColor: COLORS.white,
  },
  themeBtnTitleStyle: {
    color: COLORS.black,
  },
});

export const styledHook = StyleSheet.create({
  container: {},
  title: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 3,
    color: COLORS.white,
    marginBottom: 5,
  },
  desc: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.medium,
    color: COLORS.white,
  },
});

export const styledBalance = StyleSheet.create({
  container: {
    marginTop: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.colorGreyBold,
    marginTop: 10,
  },
  balance: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superLarge + 10,
    color: COLORS.black,
  },
  pSymbol: {
    fontFamily: FONT.NAME.specialRegular,
    fontSize: FONT.SIZE.superLarge + 8,
    lineHeight: FONT.SIZE.superLarge + 14,
    color: COLORS.black,
  },
});

export const styledAddToken = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.black,
  },
});

export const styledFollow = StyleSheet.create({
  container: {},
});

export const extraStyled = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
});

export const styledToken = StyleSheet.create({
  lastChild: {
    marginBottom: 0,
  },
});

export const rightHeaderStyled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnExportKey: {
    marginRight: 15,
  },
});
