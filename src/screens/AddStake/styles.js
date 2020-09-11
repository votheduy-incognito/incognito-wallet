import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    paddingTop: 0,
  },
  card: {
    padding: 10,
    paddingEnd: 10,
    paddingLeft: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    ...FONT.STYLE.bold,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 7,
  },
  itemRight: {
    marginLeft: 'auto',
    ...FONT.STYLE.bold,
    color: COLORS.black,
  },
  button: {
    marginTop: 40,
  },
  buy: {
    marginTop: 20,
  },
  desc: {
    ...FONT.STYLE.medium,
    color: COLORS.newGrey,
  },
  bold: {
    ...FONT.STYLE.bold,
    color: COLORS.black,
  },
  firstLine: {
    marginBottom: 10,
  },
});
