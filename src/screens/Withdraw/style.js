import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    flex: 1,
  },
  feeText: {
    textAlign: 'center',
    marginVertical: 3,
    fontSize: 14
  },
  form: {
    marginTop: 30,
    width: '100%'
  },
  submitBtn: {
    marginTop: 20
  },
  input: {
    marginBottom: 10
  },
  memoContainer: {
    marginTop: 10
  },
  memoText: {
    fontSize: 14,
    color: COLORS.lightGrey3
  },
});