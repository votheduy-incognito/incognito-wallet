import {COLORS} from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  dialog: {
    backgroundColor: COLORS.lightGrey10,
    borderRadius: 10,
    height: 'auto',
    paddingVertical: 15,
    width: 360,
  },
  dialogContent: {
    paddingVertical: 25,
    paddingHorizontal: 35
  },
  mode: {
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  active: {
    borderRadius: 25,
    borderColor: COLORS.lightGrey4,
    borderWidth: 1,
  },
  activeText: {
    color: COLORS.primary,
  },
});
