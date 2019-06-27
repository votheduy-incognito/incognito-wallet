import { StyleSheet } from 'react-native';
import { COLORS, DECOR } from '@src/styles';

export const homeStyle = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    flex: 1,
  },
  cryptoItem: {
    marginVertical: 5
  },
  addTokenContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 100
  },
  addTokenLabel: {
    fontSize: 15
  },
  addTokenBtn: {
    fontSize: 15,
    color: COLORS.blue,
    marginVertical: 20
  }
});

export const accountAddressStyle = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  copyIcon: {
    marginLeft: 3
  },
  qrCode: {
    marginBottom: 20
  },
  text: {
    fontWeight: '400'
  },
  textBox: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: DECOR.borderRadiusBorder,
    borderWidth: DECOR.borderWidth,
    flexDirection: 'row',
    padding: 10
  }
});