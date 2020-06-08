import {FONT, COLORS} from '@src/styles';
import {StyleSheet} from 'react-native';

export const styled = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 20,
  },
  input: {
    fontSize: FONT.SIZE.large,
    lineHeight: FONT.SIZE.large + 6,
    color: COLORS.black,
    paddingRight: 10,
  },
  btnSubmit: {
    marginTop: 20,
  },
  error: {
    color: '#f40000',
    textAlign: 'center',
  },
  errorInput: {
    color: '#f40000',
  },
  containerInput: {
    marginTop: 65,
    marginBottom: 5,
  },
});
