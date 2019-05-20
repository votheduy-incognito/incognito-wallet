import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT } from '@src/styles';

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.overlayBlackDark
  },
  percent: {
    color: COLORS.white,
    marginVertical: SPACING.small,
    fontSize: FONT.SIZE.medium,
    fontWeight: 'bold',
  },
  percentSymbol: {
    fontSize: FONT.SIZE.small
  },
  desc: {
    width: 200,
    fontSize: FONT.SIZE.small,
    color: COLORS.white,
    textAlign: 'center'
  }
});

export default style;