import { COLORS, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    width: '100%',
    flexDirection: 'row',
    flex: 1
  },
  input: {
    flex: 1,
    marginRight: 20,
  },
  submitBtn: {
    backgroundColor: COLORS.blue,
    minWidth: 100
  },
});

export default style;
