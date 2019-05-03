import { StyleSheet } from 'react-native';
import { SPACING, COLORS } from '@src/styles';

const style = StyleSheet.create({
  container: {

  },
  visibleEl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.small,
  },
  userName: {
    paddingHorizontal: 10.0,
    fontWeight: 'bold',
    color: COLORS.white
  },
  userIcon: {
    color: COLORS.white
  },
});

export default style;