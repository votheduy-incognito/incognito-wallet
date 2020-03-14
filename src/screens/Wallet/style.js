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
    marginTop: 0,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey5,
  },
  followTokenText: {
    justifyContent: 'center',
  },
  followTokenIcon: {
    marginRight: 20,
  },
});
