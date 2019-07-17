import { THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  errorText: {
    ...THEME.text.errorText,
    marginBottom: 10
  },
  field: {
    marginBottom: 5
  },
});
