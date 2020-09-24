import { COLORS, FONT, UTILS } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  dialog: {
    height: 'auto',
    borderRadius: 20,
    width: UTILS.screenWidth() - (27 * 2),
  },
  dialogContent: {
    paddingVertical: 40,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
  },
  icon: {
    width: 62,
    height: 62,
    marginBottom: 30,
  },
  swapSuccess: {
    width: 100,
    height: 100,
    marginTop: 15,
    marginBottom: 20,
    resizeMode: 'contain'
  },
  dialogTitle: {
    fontSize: 20,
    marginBottom: 15,
    ...FONT.STYLE.bold,
    textAlign: 'center',
  },
  dialogDesc: {
    fontSize: 18,
    paddingHorizontal: 30,
    marginBottom: 20,
    color: COLORS.dark1,
    textAlign: 'center',
  },
  dialogButton: {
    color: COLORS.primary,
    ...FONT.STYLE.bold,
    marginTop: 30,
    marginBottom: 20,
  },
  extraInfo: {
    fontSize: 16,
    marginBottom: 20,
    color: COLORS.lightGrey16,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
  },
  twoButton: {
    width: '48%',
  },
  twoButtonWrapper: {
    width: '100%',
  },
});
