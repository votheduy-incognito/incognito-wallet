import { StyleSheet } from 'react-native';
import { FONT, COLORS, SPACING } from '@src/styles';

export const networkItemStyle = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingBottom: SPACING.medium,
    justifyContent: 'space-between'
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexBasis: 60
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  textInfoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  networkName: {
    fontSize: FONT.SIZE.medium,
    color: COLORS.black
  },
  arrowIcon: {
    flexDirection: 'row',
    flexBasis: 30,
  },
  editContainer: {
    paddingHorizontal: SPACING.small,
    marginBottom: SPACING.large,
  }
});

export const networkEditStyle = StyleSheet.create({
  btnGroups: {
    flexDirection: 'row'
  },
  removeBtn: {
    width: 120,
    marginRight: SPACING.small,
  },
  saveBtn: {
    flex: 2
  }
});