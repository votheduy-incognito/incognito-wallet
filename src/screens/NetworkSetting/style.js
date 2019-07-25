import { COLORS, FONT, SPACING } from '@src/styles';
import { StyleSheet } from 'react-native';

export const networkItemStyle = StyleSheet.create({
  arrowIcon: {
    flexBasis: 30,
    flexDirection: 'row'
  },
  container: {
    flexDirection: 'column'
  },
  editContainer: {
    marginBottom: SPACING.large,
    paddingHorizontal: SPACING.small
  },
  iconContainer: {
    alignItems: 'center',
    flexBasis: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  infoContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between'
  },
  networkName: {
    fontSize: FONT.SIZE.medium
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: SPACING.medium
  },
  textInfoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  }
});

export const networkEditStyle = StyleSheet.create({
  btnGroups: {
    flexDirection: 'row'
  },
  removeBtn: {
    marginRight: SPACING.small,
    width: 120
  },
  saveBtn: {
    flex: 2
  }
});
