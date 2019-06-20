import { StyleSheet } from 'react-native';
import { THEME, COLORS, SPACING } from '@src/styles';

export default StyleSheet.create({
  button: {
    ...THEME.opacityButton.button,
    position: 'relative',
  },
  textContainer: {
    flex: 1
  },
  text: {
    ...THEME.opacityButton.buttonText,
    marginHorizontal: 5
  },
  primaryStyle: {
    ...THEME.opacityButton.button
  },
  dangerStyle: {
    ...THEME.opacityButton.button,
    backgroundColor: COLORS.red,
  },
  loadingIcon: {
    marginLeft: SPACING.small,
    position: 'absolute',
    right: SPACING.small
  }
});