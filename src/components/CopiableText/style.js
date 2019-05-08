import { StyleSheet } from 'react-native';
import { COLORS, SPACING, DECOR } from '@src/styles';

export default StyleSheet.create({
  textBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: DECOR.borderWidth,
    borderRadius: DECOR.borderRadiusBorder,
    padding: SPACING.small
  },
  text: {
    fontWeight: '400',
    flex: 1
  },
  copyIcon: {
    marginLeft: 3,
    flexBasis: 20,
  }
});
