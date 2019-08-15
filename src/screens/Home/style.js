import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

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
    marginVertical: 4
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
    color: COLORS.primary,
    marginVertical: 20
  }
});