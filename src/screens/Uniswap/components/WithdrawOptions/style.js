import { COLORS, DECOR, SPACING, UTILS, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';
import {isIOS} from '@utils/platform';

const style = StyleSheet.create({
  container: {
    position: 'relative',
    height: THEME.header.headerHeight
  },
  content: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: DECOR.borderRadiusBorder,
    borderTopRightRadius: DECOR.borderRadiusBorder,
    paddingTop: SPACING.small,
    paddingBottom: isIOS() ? 45 : 25,
    width: UTILS.deviceWidth()
  },
  contentContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.overlayBlack,
    flex: 1,
    justifyContent: 'flex-end'
  },
});

export default style;
