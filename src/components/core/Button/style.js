import { COLORS, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    ...THEME.opacityButton.button,
  },
  textContainer: {
    marginHorizontal: 5,
    flex: 1,
  },
  text: {
    ...THEME.opacityButton.buttonText,
  },
  primaryStyle: {
    ...THEME.opacityButton.button
  },
  dangerStyle: {
    ...THEME.opacityButton.button,
    backgroundColor: COLORS.red
  },
  loadingIcon: {
    marginHorizontal: 2,
  },
  primaryStyle: {
    ...THEME.opacityButton.button
  },
  text: {
    ...THEME.opacityButton.buttonText,
  }
});
