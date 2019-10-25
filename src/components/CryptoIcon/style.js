import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
  },
  logo: {
    width: 30,
    height: 30,
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
