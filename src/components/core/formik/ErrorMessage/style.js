import { StyleSheet } from 'react-native';
import { THEME } from '@src/styles';

export default StyleSheet.create({
  error: {
    fontSize: THEME.text.errorText.size,
    color: THEME.text.errorText.color,
    paddingVertical: 5,
  }
});