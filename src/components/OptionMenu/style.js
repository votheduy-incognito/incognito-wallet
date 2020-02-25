import { COLORS, DECOR, SPACING, UTILS, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

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
    paddingBottom: 50,
    width: UTILS.deviceWidth()
  },
  scrollView: {
    maxHeight: 350,
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
    fontWeight: '500',
    marginBottom: SPACING.small
  }
});

export default style;
