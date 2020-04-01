import {StyleSheet} from 'react-native';
import {COLORS, FONT} from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGrey5,
    flex: 1,
  },
  flatlist: {
    margin: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    padding: 5,
  },
  notification: {
    paddingVertical: 10,
    borderBottomColor: COLORS.lightGrey2,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    flex: 1,
    backgroundColor: COLORS.white,
  },
  lastChild: {
    borderBottomColor: 'transparent',
  },
  info: {
    flex: 1,
  },
  title: {
    color: COLORS.black,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
  },
  desc: {
    color: COLORS.lightGrey1,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 6,
  },
  time: {
    color: COLORS.lightGrey1,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.superSmall,
    lineHeight: FONT.SIZE.superSmall + 6,
    marginRight: 15,
  },
  hook: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 6,
  },
  notifyRead: {
    backgroundColor: COLORS.lightGrey4,
  },
});
