import {StyleSheet} from 'react-native';
import {FONT, COLORS} from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginTop: 20,
  },
  label: {
    textTransform: 'none',
  },
  tip: {
    textAlign: 'center',
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.lightGrey1,
    marginVertical: 40,
    paddingHorizontal: 40,
  },
});

export const styledModal = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGrey6,
    flex: 1,
    padding: 20,
    position: 'relative',
    zIndex: 100,
  },
});

export const emptyListStyled = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  hook: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    color: COLORS.lightGrey1,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    marginTop: 10,
  },
  notFoundImg: {
    width: 194,
    height: 164,
  },
  btnUseAddr: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});

export const listStyled = StyleSheet.create({
  container: {
    borderRadius: 8,
    backgroundColor: COLORS.white,
    marginVertical: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 10
  },
  all: {
    color: COLORS.black,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    marginLeft: 15,
  },
});
export const itemStyled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  hook: {
    flex: 1,
    paddingHorizontal: 20,
    width: '98%',
  },
  name: {
    color: COLORS.black,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
  },
  address: {
    color: COLORS.lightGrey1,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.regular + 6,
    marginTop: 1,
  },
  lastChild: {
    borderBottomColor: 'transparent',
  },
});
