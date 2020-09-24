import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
  },
  rowOld: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.colorGreyMedium,
  },
  focus: {
    borderBottomColor: COLORS.primary,
  },
  label: {
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
    color: COLORS.black,
  },
  labelFocus: {
    color: COLORS.primary,
  },
  labelOld: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 4,
  },
  input: {
    flex: 1,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 4,
    color: COLORS.colorGreyBold,
    marginRight: 5,
    padding: 0,
  },
  oldInput: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default style;
