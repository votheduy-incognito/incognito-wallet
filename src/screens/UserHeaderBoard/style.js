import { StyleSheet } from 'react-native';
import { SPACING, DECOR, COLORS } from '@src/styles';

const style = StyleSheet.create({
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: DECOR.buttonHeight
  },
  actionItemIcon: {
    color: COLORS.blue,
    marginRight: SPACING.small,
  },
  actionItemLabel: {
    fontWeight: '400'
  },
  divider: {
    marginTop: 20
  }
});

export default style;