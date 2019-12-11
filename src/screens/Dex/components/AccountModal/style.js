import {COLORS, FONT} from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  accountName: {
    flex: 1,
  },
  active: {
    color: COLORS.primary,
    ...FONT.STYLE.medium,
  }
});
