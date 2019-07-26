import { FONT, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    marginTop: 30,
    width: '100%'
  },
  input: {
    marginBottom: 15
  },
  noteText: {
    fontSize: FONT.SIZE.small,
    fontWeight: 'bold',
    marginVertical: 15
  },
  submitBtn: {
    marginTop: 30
  },
  title: {
    fontSize: THEME.text.largeTitleSize,
    fontWeight: 'bold'
  },
  balance: {
    textAlign: 'center'
  }
});

export default style;
