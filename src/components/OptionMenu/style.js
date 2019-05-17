import { StyleSheet } from 'react-native';
import { COLORS, DECOR, SPACING, UTILS } from '@src/styles';

const style = StyleSheet.create({
  container: {
    position: 'relative'
  },
  iconBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: COLORS.overlayBlack,
  },
  content: {
    backgroundColor: COLORS.white,
    borderRadius: DECOR.borderRadiusBorder,
    width: UTILS.deviceWidth(),
    padding: SPACING.small,
  },
  title: {
    fontWeight: '500',
    marginBottom: SPACING.small,
  },
  menuItem: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemText: {
  },
  icon: {
    flexBasis: 30,
  }
});

export default style;