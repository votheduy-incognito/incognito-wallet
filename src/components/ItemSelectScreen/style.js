import { StyleSheet } from 'react-native';
import {COLORS, FONT} from '@src/styles';

const style = StyleSheet.create({
  container: {
    paddingTop: 30,
  },
  row: {
    flexDirection: 'row',
  },
  networkName: {
    color: COLORS.lightGrey16,
    ...FONT.STYLE.medium,
    marginRight: 5,
    fontSize: 18,
    lineHeight: 23,
  },
  name: {
    ...FONT.STYLE.bold,
    fontSize: 20,
    lineHeight: 24,
    marginBottom: 10,
  },
  content: {
    paddingTop: 42,
    paddingBottom: 30,
  },
  item: {
    marginBottom: 30,
  },
  input: {
    fontSize: 20,
    ...FONT.STYLE.medium,
    flex: 1,
  },
});

export default style;
