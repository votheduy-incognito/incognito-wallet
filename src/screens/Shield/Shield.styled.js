import { StyleSheet } from 'react-native';
import { UTILS } from '@src/styles';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlist: {
    flex: 1,
  },
  styledSymbol: {
    maxWidth: '100%',
  },
  styledName: {
    maxWidth: UTILS.screenWidth() - 70,
  },
  styledContainerName: {
    maxWidth: '100%',
  },
});
