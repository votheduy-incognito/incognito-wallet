import {COLORS, FONT} from '@src/styles';
import {StyleSheet} from 'react-native';

export const styled = StyleSheet.create({
  container: {
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: COLORS.lightGrey2,
    borderBottomWidth: 0.5,
    paddingVertical: 5,
  },
  title: {
    flex: 2,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 6,
    color: COLORS.lightGrey1,
  },
  desc: {
    flex: 4,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 6,
    color: COLORS.black,
  },
  btnRetry: {
    marginTop: 20,
  },
});
