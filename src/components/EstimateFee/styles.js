import { SPACING, COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.small,
    paddingLeft: SPACING.small,
    display: 'flex'
  },
  rate: {},
  rateHighlight: {
    backgroundColor: COLORS.red
  },
  feeType: {},
  feeTypeHighlight: {
    backgroundColor: COLORS.blue
  }
});

export default style;
