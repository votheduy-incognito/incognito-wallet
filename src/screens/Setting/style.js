import { COLORS, FONT, SPACING } from '@src/styles';
import { StyleSheet } from 'react-native';

export const sectionStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: SPACING.small
  },
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    width: 60
  },
  infoContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  item: {
    flexDirection: 'row'
  },
  items: {
    marginVertical: SPACING.small
  },
  label: {
    color: COLORS.lightGrey1,
    fontWeight: 'bold'
  },
  titleItem: {
    fontSize: FONT.SIZE.medium
  }
});
