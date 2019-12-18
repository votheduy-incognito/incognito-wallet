import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGrey10
  },
  logo: {
    width: 36,
    height: 36,
    overflow: 'hidden',
    resizeMode: 'contain'
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
});
