import { SPACING, COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.small,
    paddingLeft: SPACING.small,
    display: 'flex'
  },
  rate: {},
  highlight: {
    backgroundColor: COLORS.red
  }
});

export default style;
