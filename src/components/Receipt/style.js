import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingTop: 100
  },
  infoContainer: {
    marginTop: SPACING.medium
  },
  modalContainer: {
    backgroundColor: COLORS.primary
  },
  text: {
    color: COLORS.white,
    fontSize: FONT.SIZE.regular,
    marginVertical: 2,
  }
});
