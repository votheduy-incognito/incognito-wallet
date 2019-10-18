import {COLORS, FONT, THEME} from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    ...THEME.opacityButton.button,
    height: 44,
    borderRadius: 8,
  },
  text: {
    ...THEME.opacityButton.buttonText,
    ...FONT.STYLE.medium,
    ...FONT.SIZE.medium,
  },
  textContainer: {
    marginHorizontal: 5,
    flex: 1,
  },
  dangerStyle: {
    ...THEME.opacityButton.button,
    backgroundColor: COLORS.red
  },
  primaryStyle: {
    ...THEME.opacityButton.button,
    backgroundColor: COLORS.blue,
  },
  secondaryStyle: {
    ...THEME.opacityButton.button,
    backgroundColor: COLORS.dark3,
  },
  loadingIcon: {
    marginHorizontal: 2,
  },
  disabled: {
    ...THEME.opacityButton.disabled,
  },
});
