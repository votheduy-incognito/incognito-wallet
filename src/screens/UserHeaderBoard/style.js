import { StyleSheet } from 'react-native';
import { SPACING, DECOR, COLORS } from '@src/styles';

export const accountListStyle = StyleSheet.create({
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: DECOR.buttonHeight,
    marginBottom: SPACING.small
  },
  accountItemIcon: {
    color: COLORS.blue,
    marginRight: SPACING.small,
  },
  accountItemLabel: {
    fontWeight: '400',
    color: COLORS.black
  },
  activeIconContainer: {
    width: 30
  }
});

export const actionBtnStyle = StyleSheet.create({
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: DECOR.buttonHeight,
    marginBottom: SPACING.small
  },
  actionItemIcon: {
    color: COLORS.blue,
    marginRight: SPACING.small,
  },
  actionItemLabel: {
    fontWeight: '400',
    color: COLORS.black
  },
  divider: {
    marginVertical: 20
  },
  activeIconContainer: {
    width: 30
  }
});