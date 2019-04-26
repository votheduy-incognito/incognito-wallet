import { StyleSheet } from 'react-native';
import { THEME } from '@src/styles';

export default StyleSheet.create({
  button: {
    ...THEME.opacityButton.button
  },
  text: {
    ...THEME.opacityButton.buttonText
  }
});