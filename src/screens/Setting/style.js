import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT } from '@src/styles';

export const sectionStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: SPACING.small
  },
  label: {
    fontWeight: 'bold',
    color: COLORS.lightGrey
  },
  items: {
    marginVertical: SPACING.small
  },
  item: {
    flexDirection: 'row',
  },
  iconContainer: {
    flexDirection: 'row',
    width: 60,
    alignItems: 'center'
  },
  infoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleItem: {
    fontSize: FONT.SIZE.medium,
    color: COLORS.black
  }
});