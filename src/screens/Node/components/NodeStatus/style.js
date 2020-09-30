import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';
import { isIOS } from '@utils/platform';

export default StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  title: {
    color: COLORS.black,
    fontSize: 20,
    ...FONT.STYLE.bold,
  },
  desc: {
    color: COLORS.newGrey,
    fontSize: 16,
    lineHeight: isIOS() ? 25 : 30,
    ...FONT.STYLE.medium
  },
});
