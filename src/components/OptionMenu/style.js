import { COLORS, DECOR, SPACING, UTILS, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';
import {isIOS} from '@utils/platform';

const style = StyleSheet.create({
  container: {
    position: 'relative',
    height: THEME.header.headerHeight
  },
  toggleBtn: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
    width: 45,
  },
  content: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: DECOR.borderRadiusBorder,
    borderTopRightRadius: DECOR.borderRadiusBorder,
    paddingTop: SPACING.small,
    paddingBottom: isIOS() ? 45 : 25,
    width: UTILS.deviceWidth()
  },
  barIcon: {
    backgroundColor: COLORS.white,
    width: 50,
    height: 5,
    borderRadius: 3,
    position: 'relative',
    top: -28,
    left: UTILS.deviceWidth()/2,
    transform: [{ translateX: -25}]
  },
  search: {
    backgroundColor: COLORS.lightGrey6,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 55,
    marginLeft: 10,
    flex: 1,
    color: COLORS.dark1,
  },
  contentContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.overlayBlack,
    flex: 1,
    justifyContent: 'flex-end'
  },
  icon: {
    flexBasis: 45,
    paddingTop: 0,
  },
  iconBtn: {
    alignItems: 'center',
    display: 'flex',
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  itemText: {},
  itemDescText: {
    fontSize: 15,
    color: COLORS.lightGrey1,
    marginTop: 5,
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  itemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey6
  },
  title: {
    fontSize: 12,
    marginLeft: 15,
    marginBottom: 10,
    letterSpacing: 1.5,
    color: COLORS.lightGrey1,
  }
});

export default style;
