import { THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  error: {
    color: THEME.text.errorText.color,
    fontSize: THEME.text.errorText.size,
    paddingVertical: 5
  }
});
