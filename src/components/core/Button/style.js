import {COLORS, FONT, THEME} from '@src/styles';
import { StyleSheet } from 'react-native';
import {scaleInApp} from '@src/styles/TextStyle';

export default StyleSheet.create({
  button: {
    ...THEME.opacityButton.button,
    borderRadius: 4,
  },
  text: {
    ...THEME.opacityButton.buttonText,
    ...FONT.STYLE.medium,
    ...FONT.SIZE.medium,
  },
  textContainer: {
    marginHorizontal: 5,
    paddingVertical: 12,
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
    marginTop: 6,
    marginHorizontal: 2,
  },
  disabled: {
    ...THEME.opacityButton.disabled,
  },
});
