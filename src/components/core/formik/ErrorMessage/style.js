import { THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  error: {
    ...THEME.text.errorText,
    paddingVertical: 5
  }
});
