import { StyleSheet } from 'react-native';
import { THEME, COLORS } from '@src/styles';

export default StyleSheet.create({
  button: {
    ...THEME.opacityButton.button
  },
  text: {
    ...THEME.opacityButton.buttonText
  },
  primaryStyle: {
    ...THEME.opacityButton.button
  },
  dangerStyle: {
    ...THEME.opacityButton.button,
    backgroundColor: COLORS.red,
  } 
});