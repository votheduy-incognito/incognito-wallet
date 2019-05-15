import { StyleSheet } from 'react-native';
import { FONT, SPACING, COLORS } from '@src/styles';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    marginVertical: SPACING.small
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
  },
  image: {
    marginRight: SPACING.small,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  feeText: {
    fontSize: FONT.SIZE.small,
    flex: 1
  },
  statusText: {
    fontSize: FONT.SIZE.small,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1
  },
  amountText: {
    fontWeight: 'bold',
    color: COLORS.black,
    textAlign: 'right',
    flex: 1
  },
  receiverText: {
    flex: 1
  },
  timeText: {
    flex: 1
  },
  divider: {
    marginVertical: 5,
  }
});

export default style;