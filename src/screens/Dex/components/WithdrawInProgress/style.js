import { COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: COLORS.dark2,
    alignItems: 'center',
  },
  amount: {
    fontSize: 14,
    color: COLORS.white,
    flex: 1,
  },
});
