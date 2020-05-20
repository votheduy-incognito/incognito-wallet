import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    marginBottom: 15,
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    color: COLORS.black,
  },
  input: {
    flex: 1,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.superMedium,
    color: COLORS.colorGreyBold,
  },
});

export default style;
