import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

const bottomBarHeight = 50;

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  warning: {
    color: COLORS.orange,
  },
  wrapper: {
    paddingTop: 42,
  },
  bottomFloatBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    color: COLORS.lightGrey16,
    ...FONT.STYLE.medium,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
    height: bottomBarHeight,
    justifyContent: 'center',
    alignItems: 'flex-end',
    left: 0,
    right: 0,
    paddingBottom: 25,
  },
});
