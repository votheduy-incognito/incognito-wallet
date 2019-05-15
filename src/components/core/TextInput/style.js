import { StyleSheet } from 'react-native';
import { THEME } from '@src/styles';

const style = StyleSheet.create({
  container: {
    ...THEME.textInput,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1
  }
});

export default style;