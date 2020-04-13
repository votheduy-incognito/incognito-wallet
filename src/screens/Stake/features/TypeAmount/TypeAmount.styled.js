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
    borderBottomColor: COLORS.lightGrey5,
    borderBottomWidth: 2,
    textAlign: 'center',
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.large,
    lineHeight: FONT.SIZE.large + 6,
    color: COLORS.black,
    marginBottom: 15,
    marginTop: 65,
  },
  btnSubmit: {
    marginTop: 20,
  },
  error: {
    textAlign: 'center',
    marginTop: 10,
  },
});
