import { StyleSheet } from 'react-native';
import {COLORS, FONT} from '@src/styles';

const style = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 80,
  },
  row: {
    flexDirection: 'row',
    paddingBottom: 20,
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
  tokenName: {
    ...FONT.STYLE.bold,
    fontSize: 24,
    marginBottom: 10,
  },
});

export default style;
