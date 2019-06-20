import { COLORS, SPACING } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {},
  userIcon: {
    color: COLORS.white
  },
  userName: {
    color: COLORS.white,
    fontWeight: 'bold',
    paddingHorizontal: 10.0
  },
  visibleEl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.small
  }
});

export default style;
