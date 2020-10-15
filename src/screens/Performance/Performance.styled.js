import { StyleSheet } from 'react-native';
import { UTILS } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    zIndex: 1000,
    width: UTILS.screenWidth() - 50,
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    paddingLeft: 5,
    borderRadius: 8,
    height: UTILS.screenHeight() * 0.4,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  scrollview: {
    backgroundColor: 'transparent'
  },
  text: {
    color: '#41E632',
  },
  btn: {
    alignItems: 'flex-end',
    position: 'absolute',
    right: 5,
    top: 5
  },
  abs: {
    position: 'absolute',
    bottom: 25,
    right: 25,
  },
});
