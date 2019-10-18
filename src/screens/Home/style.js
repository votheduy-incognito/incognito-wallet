import { StyleSheet } from 'react-native';
import {COLORS, FONT} from '@src/styles';

export const homeStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrey6,
  },
  bgStyle: {
    backgroundColor: COLORS.primary,
    height: 60,
  },
  mainContainer: {
    flex: 1,
    position: 'relative',
    top: -55
  },
  cryptoItem: {
    marginVertical: 4,
  },
  addTokenContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 50
  },
  addTokenLabel: {
    fontSize: 15
  },
  addTokenBtn: {
    fontSize: 15,
    paddingVertical: 16,
    paddingHorizontal: 30,
    backgroundColor: COLORS.primary,
    marginVertical: 20,
    flexDirection: 'row',
    flex: 1,
    borderRadius: 6,
  },
  addTokenBtnText: {
    fontSize: 15,
    color: COLORS.white,
    ...FONT.STYLE.medium,
  },
  icon: {
    paddingTop: 2,
    marginRight: 5,
  },
});
