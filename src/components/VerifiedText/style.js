import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

const FLAG_SIZE = 14;

export default StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  verifiedFlagContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: COLORS.white,
    width: FLAG_SIZE,
    height: FLAG_SIZE,
    borderRadius: FLAG_SIZE,
    top: 2,
    right: -22,
  },
  verifiedFlag: {
    color: COLORS.green,
    height: FLAG_SIZE,
    width: FLAG_SIZE
  },
  text: {
    alignSelf: 'flex-start',
  },
});
