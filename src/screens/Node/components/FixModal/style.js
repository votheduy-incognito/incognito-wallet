import { COLORS, SPACING, UTILS, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  toggleBtn: {
    backgroundColor: COLORS.dark3,
    height: 30,
    minWidth: 80,
  },
  container: {
    position: 'relative',
    height: THEME.header.headerHeight
  },
  content: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: SPACING.small,
    paddingBottom: 50,
    width: UTILS.deviceWidth()
  },
  contentContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.overlayBlack,
    flex: 1,
    justifyContent: 'flex-end'
  },
  iconContainer: {
    width: 80,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  title: {
    fontWeight: '500',
    marginBottom: SPACING.small
  },
  menuItem: {
    flex: 1,
    marginRight: 20,
  },
  text: {
    marginBottom: 25,
  },
  closeText: {
    fontSize: 14,
    marginLeft: 25,
    marginTop: 5,
    marginBottom: 45,
  },
});

export default style;
