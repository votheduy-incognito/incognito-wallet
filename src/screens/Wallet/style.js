import { StyleSheet } from 'react-native';
import {COLORS, FONT} from '@src/styles';

export const homeStyle = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    position: 'relative',
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
    marginTop: 20,
  },
  followTokenBtn: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followTokenText: {
    ...FONT.STYLE.medium,
    fontSize: 15,
    color: COLORS.primary,
    justifyContent: 'center',
  },
  followTokenIcon: {
    marginTop: 1,
    height: 24,
  },
});
