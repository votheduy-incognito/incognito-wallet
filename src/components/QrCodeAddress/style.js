import { StyleSheet } from 'react-native';
import { COLORS, DECOR } from '@src/styles';

export default StyleSheet.create({
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
    borderColor: COLORS.lightGrey3,
    borderWidth: DECOR.borderWidth,
    flexDirection: 'row',
    padding: 10
  }
});