import { FONT, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  form: {
    marginTop: 30,
    width: '100%'
  },
  noteText: {
    fontSize: FONT.SIZE.small,
    fontWeight: 'bold',
    marginVertical: 15
  },
  submitBtn: {
    marginTop: 20
  },
  title: {
    fontSize: THEME.text.largeTitleSize,
    fontWeight: 'bold'
  }
});

export default style;
