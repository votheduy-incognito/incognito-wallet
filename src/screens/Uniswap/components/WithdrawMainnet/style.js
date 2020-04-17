import {COLORS, FONT} from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  dialog: {
    height: 'auto',
    borderRadius: 10,
  },
  dialogContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
  },
  title: {
    ...FONT.STYLE.medium,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: COLORS.dark1,
    marginTop: 20,
  },
  desc: {
    fontSize: 14,
    color: COLORS.lightGrey9,
    marginBottom: 15,
    textAlign: 'center',
  },
  btn: {
    marginTop: 15,
    marginHorizontal: 15,
    width: '100%',
  },
});
