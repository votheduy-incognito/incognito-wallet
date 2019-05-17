import { StyleSheet } from 'react-native';
import { FONT, SPACING, COLORS } from '@src/styles';

const style = StyleSheet.create({
  container: {
    flex: 1,
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
  
});

export const tokenItemStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginVertical: 3,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    flexBasis: 40,
    marginRight: SPACING.medium
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  name: {
    color: COLORS.black
  },
  amount: {},
  divider: {
    marginVertical: 5,
  },
  itemContainer: {
    marginVertical: SPACING.small
  },
});

export const tokenStyle = StyleSheet.create({
  initTokenBtn: {

  },
  addFollowTokenBtn: {
    color: COLORS.green,
    marginBottom: SPACING.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addFollowTokenBtnText: {
    color: COLORS.green,
    fontWeight: 'bold',
    marginLeft: 5
  }
});

export default style;