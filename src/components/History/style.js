import { COLORS, FONT, SPACING } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  amountText: {
    color: COLORS.black,
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  container: {
    flex: 1
  },
  divider: {
    marginVertical: 5
  },
  feeText: {
    flex: 1,
    fontSize: FONT.SIZE.small
  },
  image: {
    borderRadius: 20,
    height: 40,
    marginRight: SPACING.small,
    width: 40
  },
  itemContainer: {
    marginVertical: SPACING.small
  },
  receiverText: {
    flex: 1
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3
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
