import { FONT, THEME, COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: 1000
  },
  form: {
    flex: 1,
    flexDirection: 'column',
    width: '100%'
  },
  desc: {
    marginBottom: 10
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
    marginTop: 40,
    borderRadius: 4,
  },
  title: {
    fontSize: THEME.text.largeTitleSize,
    fontWeight: 'bold'
  },
  balance: {
    textAlign: 'center'
  },
  error: {
    color: COLORS.red,
    fontSize: FONT.SIZE.small,
  },
});

export default style;
