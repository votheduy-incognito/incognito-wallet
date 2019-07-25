import { COLORS, FONT, SPACING } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3
  },
  itemContainer: {
    marginVertical: SPACING.small
  },
  amountText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  addressText: {
    flex: 1
  },
  typeText: {
    flex: 1
  },
  statusText: {
    flex: 1,
    fontSize: FONT.SIZE.small,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  timeText: {
    flex: 1
  }
});

export default style;
