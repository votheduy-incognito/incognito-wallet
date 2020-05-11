import { StyleSheet } from 'react-native';
import { FONT, COLORS } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  groupButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnStyle: {
    width: '100%',
    maxWidth: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    padding: 13,
  },
  titleStyle: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
  },
});

export const styledHook = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  title: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.large + 3,
    lineHeight: FONT.SIZE.large + 6,
    color: COLORS.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  desc: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.lightGrey1,
    textAlign: 'center',
  },
});

export const styledBalance = StyleSheet.create({
  container: {
    marginVertical: 50,
  },
  balance: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superLarge + 10,
    color: COLORS.black,
    textAlign: 'center',
  },
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.lightGrey1,
    textAlign: 'center',
    marginTop: 5,
  },
});

export const styledAddToken = StyleSheet.create({
  container: {},
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.black,
  },
});

export const styledFollow = StyleSheet.create({
  container: {
    marginVertical: 50,
  },
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
    marginRight: 10,
  },
});
