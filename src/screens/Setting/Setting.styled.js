import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

export const settingStyle = StyleSheet.create({
  textVersion: {
    textAlign: 'center',
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 3,
    color: COLORS.black,
    marginBottom: 25,
  },
});
