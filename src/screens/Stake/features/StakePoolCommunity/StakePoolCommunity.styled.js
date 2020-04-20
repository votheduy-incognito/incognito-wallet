import {StyleSheet} from 'react-native';
import {FONT, COLORS} from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    marginTop: 70,
  },
  title: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.lightGrey1,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderColor: COLORS.lightGrey4,
    borderWidth: 0.5,
    borderRadius: 4,
    marginTop: 10,
  },
  icon: {
    width: 28,
    height: 28,
  },
  pool: {
    flex: 1,
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.black,
    paddingLeft: 15,
  },
});
