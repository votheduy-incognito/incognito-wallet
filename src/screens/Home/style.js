import { StyleSheet } from 'react-native';
import {COLORS, FONT} from '@src/styles';
import {scaleInApp} from "@src/styles/TextStyle";

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
  addTokenBtn: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    backgroundColor: COLORS.primary,
    marginVertical: 20,
    flexDirection: 'row',
    flex: 1,
    borderRadius: 6,
  },
  addTokenBtnText: {
    fontSize: scaleInApp(15),
    color: COLORS.white,
    ...FONT.STYLE.medium,
  },
  icon: {
    paddingTop: 2,
    marginRight: 5,
  },
});
