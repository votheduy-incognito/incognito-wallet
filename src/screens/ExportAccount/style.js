import { COLORS, SPACING } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
  },
  itemContainer: {
    backgroundColor: COLORS.lightGrey2,
    marginBottom: SPACING.small,
    padding: 5,
  },
  itemData: {},
  itemLabel: {}
});

export default style;
