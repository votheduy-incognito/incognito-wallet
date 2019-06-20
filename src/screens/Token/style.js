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
  feeText: {
    flex: 1,
    fontSize: FONT.SIZE.small
  },
  receiverText: {
    flex: 1
  },
  statusText: {
    flex: 1,
    fontSize: FONT.SIZE.small,
    fontWeight: 'bold',
    textAlign: 'right'
  }
});

export const tokenItemStyle = StyleSheet.create({
  amount: {},
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 3,
    paddingVertical: 10
  },
  divider: {
    marginVertical: 5
  },
  image: {
    borderRadius: 20,
    flexBasis: 40,
    height: 40,
    marginRight: SPACING.medium,
    width: 40
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  itemContainer: {
    marginVertical: SPACING.small
  },
  name: {
    color: COLORS.black
  }
});

export const tokenStyle = StyleSheet.create({
  addFollowTokenBtn: {
    alignItems: 'center',
    color: COLORS.green,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.medium
  },
  addFollowTokenBtnText: {
    color: COLORS.green,
    fontWeight: 'bold',
    marginLeft: 5
  },
  initTokenBtn: {}
});

export default style;
