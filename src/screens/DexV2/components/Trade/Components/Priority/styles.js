import { StyleSheet } from 'react-native';
import {COLORS} from '@src/styles';

export default StyleSheet.create({
  wrapper: {
    flexDirection: 'row'
  },
  wrapperItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 57,
    height: 28,
    backgroundColor: COLORS.lightGrey19,
    marginRight: 10,
    borderRadius: 16,
  },
  itemSelected: {
    backgroundColor: '#333335',
  },
  lightningIcon: {
    width: 12,
    height: 14,
    tintColor: COLORS.newGrey,
    resizeMode: 'contain'
  },
  lightningSelected: {
    tintColor: COLORS.white,
  }
});