import { COLORS, DECOR, SPACING } from '@src/styles';
import { StyleSheet } from 'react-native';

export const accountListStyle = StyleSheet.create({
  accountItem: {
    alignItems: 'center',
    flexDirection: 'row',
    height: DECOR.buttonHeight,
    marginBottom: SPACING.small
  },
  accountItemIcon: {
    color: COLORS.blue,
    marginRight: SPACING.small
  },
  accountItemLabel: {
    fontWeight: '400'
  },
  activeIconContainer: {
    width: 30
  }
});

export const actionBtnStyle = StyleSheet.create({
  actionItem: {
    alignItems: 'center',
    flexDirection: 'row',
    height: DECOR.buttonHeight,
    marginBottom: SPACING.small
  },
  actionItemIcon: {
    color: COLORS.blue,
    marginRight: SPACING.small
  },
  actionItemLabel: {
    fontWeight: '400'
  },
  activeIconContainer: {
    width: 30
  },
  divider: {
    marginVertical: 20
  }
});
