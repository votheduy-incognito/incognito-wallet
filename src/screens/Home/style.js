import { StyleSheet } from 'react-native';
import {COLORS, FONT} from '@src/styles';

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
    fontSize: 18,
    color: COLORS.white,
    marginLeft: 'auto',
    marginRight: 'auto',
    ...FONT.STYLE.bold,
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
    height: 1040,
    top: -1000,
    position: 'absolute',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  mainContainer: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 15,
    marginBottom: 15,
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
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  addTokenBtnText: {
    color: COLORS.white,
  },
  followTokenTitle: {
    fontSize: FONT.SIZE.regular,
    marginTop: 30,
  },
  followTokenBtn: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  followTokenText: {
    ...FONT.STYLE.medium,
    fontSize: 15,
    color: COLORS.primary,
    justifyContent: 'center',
  },
  followTokenIcon: {
    color: COLORS.primary,
    marginTop: 1,
    height: 24,
    fontSize: 24,
  },
});
