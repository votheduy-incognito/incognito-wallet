import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: COLORS.lightGrey10
  },
  logo: {
    overflow: 'hidden',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  hidden: {
    display: 'none'
  },
  loadingIcon: {
    justifyContent: 'center',
    position: 'absolute',
    alignItems: 'center',
    height: '100%'
  },
  verifiedFlagContainer: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  verifiedFlag: {
    color: COLORS.green,
  },
});
