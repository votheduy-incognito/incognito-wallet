import { StyleSheet } from 'react-native';
import { FONT } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  desc: {
    marginBottom: 10,
  },
  submitBtn: {
    marginTop: 30,
    borderRadius: 4,
  },
  input: {
    marginBottom: 15,
  },
  text: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
  },
  boldText: {
    fontFamily: FONT.NAME.medium,
  },
});
