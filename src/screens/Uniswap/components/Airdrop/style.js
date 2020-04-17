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
  actions: {
    marginTop: 15,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  closeBtn: {
    flex: 1,
    marginRight: 2.5,
    backgroundColor: COLORS.lightGrey16,
  },
  closeText: {
    color: COLORS.black,
  },
  okBtn: {
    flex: 1,
    marginLeft: 2.5,
  },
});
