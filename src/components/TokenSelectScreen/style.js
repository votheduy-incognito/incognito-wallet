import { StyleSheet } from 'react-native';
import {COLORS, FONT} from '@src/styles';

const style = StyleSheet.create({
  container: {
    paddingBottom: 80,
  },
  row: {
    flexDirection: 'row',
  },
  networkName: {
    color: COLORS.lightGrey16,
    marginRight: 5,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: COLORS.black,
    fontFamily: FONT.NAME.regular,
  },
  tokenItem: {
    marginBottom: 20,
  },
  tokenName: {
    ...FONT.STYLE.bold,
    fontSize: 20,
  },
});

export default style;
