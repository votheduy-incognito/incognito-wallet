import {COLORS, DECOR, SPACING, UTILS, THEME, FONT} from '@src/styles';
import { StyleSheet } from 'react-native';
import {isIOS} from '@utils/platform';

const style = StyleSheet.create({
  container: {
    position: 'relative',
    height: THEME.header.headerHeight
  },
  content: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingTop: SPACING.small,
    paddingBottom: isIOS() ? 45 : 25,
    width: '100%',
    paddingHorizontal: 55,
  },
  contentContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.overlayBlack,
    flex: 1,
    justifyContent: 'flex-end'
  },
});

export const stepStyles = StyleSheet.create({
  step: {
    textAlign: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    ...FONT.STYLE.medium,
    color: COLORS.dark1,
    marginBottom: 8,
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: COLORS.dark1,
    marginBottom: 20,
    marginHorizontal: 45,
    textAlign: 'center',
  },
  action: {
    marginBottom: 25,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.lightGrey5,
    marginBottom: 25,
  },
});

export default style;
