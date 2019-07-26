import { COLORS, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    width: '100%'
  },
  submitBtn: {
    backgroundColor: COLORS.blue,
    marginTop: 30
  },
  title: {
    fontSize: THEME.text.largeTitleSize,
    fontWeight: 'bold'
  }
});

export default style;
