import { COLORS, DECOR, SPACING, UTILS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    position: 'relative'
  },
  content: {
    backgroundColor: COLORS.white,
    borderRadius: DECOR.borderRadiusBorder,
    padding: SPACING.small,
    width: UTILS.deviceWidth()
  },
  contentContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.overlayBlack,
    flex: 1,
    justifyContent: 'flex-end'
  },
  icon: {
    flexBasis: 30
  },
  iconBtn: {
    alignItems: 'center',
    display: 'flex',
    height: 30,
    justifyContent: 'center',
    width: 30
  },
  itemText: {},
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10
  },
  title: {
    fontWeight: '500',
    marginBottom: SPACING.small
  }
});

export default style;
