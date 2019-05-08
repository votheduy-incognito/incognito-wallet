import { StyleSheet } from 'react-native';
import { THEME, COLORS } from '@src/styles';

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: THEME.text.largeTitleSize,
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
    marginTop: 30
  },
  submitBtn: {
    marginTop: 30,
    backgroundColor: COLORS.green
  }
});

export default style;