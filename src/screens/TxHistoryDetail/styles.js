import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT } from '@src/styles';

export default StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flexDirection: 'column',
    alignItems: 'center'
  },
  rowText: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 5,
  },
  icon: {
    fontSize: 100,
    color: COLORS.primary,
    marginVertical: 40
  },
  labelText: {
    flex: 1,
    marginRight: 15,
    color: COLORS.lightGrey1,
    fontSize: 15,
    marginVertical: 2,
    textAlign: 'right'
  },
  valueText: {
    flex: 3,
    color: COLORS.dark1,
    fontSize: 15,
    marginVertical: 2,
  },
  txButton: {
    flex: 3,
    backgroundColor: COLORS.green,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 3
  },
  txButtonText: {
    color: COLORS.white
  },
});
