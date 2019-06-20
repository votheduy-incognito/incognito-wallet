import { COLORS, SPACING, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  button: {
    ...THEME.opacityButton.button,
    position: 'relative'
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
    backgroundColor: COLORS.red
  },
  loadingIcon: {
    marginLeft: SPACING.small,
    position: 'absolute',
    right: SPACING.small
  },
  primaryStyle: {
    ...THEME.opacityButton.button
  },
  text: {
    ...THEME.opacityButton.buttonText,
    marginHorizontal: SPACING.small
  }
});
