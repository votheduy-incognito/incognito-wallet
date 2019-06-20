import { COLORS, FONT, SPACING } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.overlayBlackDark,
    flex: 1,
    justifyContent: 'center'
  },
  desc: {
    color: COLORS.white,
    fontSize: FONT.SIZE.small,
    textAlign: 'center',
    width: 200
  },
  percent: {
    color: COLORS.white,
    fontSize: FONT.SIZE.medium,
    fontWeight: 'bold',
    marginVertical: SPACING.small
  },
  percentSymbol: {
    fontSize: FONT.SIZE.small
  }
});

export default style;
