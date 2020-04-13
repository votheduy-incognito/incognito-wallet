import {StyleSheet} from 'react-native';
import {COLORS, FONT} from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrey5,
  },
  flatList: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    margin: 20,
    padding: 15,
  },
  item: {
    borderBottomColor: COLORS.lightGrey2,
    borderBottomWidth: 1,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastChild: {
    borderBottomColor: 'transparent',
  },
  type: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
  },
  amount: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.lightGrey1,
  },
  status: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 6,
    marginRight: 15,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
