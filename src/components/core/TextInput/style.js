import { THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    ...THEME.textInput,
    alignItems: 'center',
    flexDirection: 'row'
  },
  input: {
    flex: 1
  }
});

export default style;
