import { StyleSheet } from 'react-native';
import {COLORS, FONT} from '@src/styles';
import {scaleInApp} from '@src/styles/TextStyle';

export const homeStyle = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
  },
  setting: {
    marginHorizontal: 25,
    width: 24,
    height: 24,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  title: {
    fontSize: scaleInApp(18),
    color: COLORS.white,
    marginLeft: 'auto',
    marginRight: 'auto',
    ...FONT.STYLE.medium,
    marginVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrey6,
    position: 'relative',
  },
  bgStyle: {
    backgroundColor: COLORS.primary,
    width: '100%',
    height: scaleInApp(1040),
    top: -1080,
    position: 'absolute',
    borderBottomLeftRadius: scaleInApp(30),
    borderBottomRightRadius: scaleInApp(30),
  },
  mainContainer: {
    flex: 1,
    position: 'relative',
    marginHorizontal: scaleInApp(15),
    marginBottom: scaleInApp(15),
    padding: 0,
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  cryptoItem: {
    marginVertical: 0,
  },
  addTokenContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 25
  },
  addTokenBtn: {
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 6,
  },
  addTokenBtnText: {
    fontSize: scaleInApp(15),
    color: COLORS.white,
    ...FONT.STYLE.medium,
  },
  followTokenTitle: {
    fontSize: scaleInApp(15),
    marginTop: 30,
  },
  followTokenBtn: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  followTokenText: {
    ...FONT.STYLE.medium,
    fontSize: scaleInApp(15),
    color: COLORS.primary,
    justifyContent: 'center',

  },
  followTokenIcon: {
    color: COLORS.primary,
    fontSize: scaleInApp(24),
  },
});
