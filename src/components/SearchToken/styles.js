import { COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

export const itemStyle = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  highlight: {
    backgroundColor: COLORS.lightGrey1,
    borderRadius: 5,
  },
});

export const searchPTokenStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  searchInput: {
    height: 60
  },
  listToken: {
    marginVertical: 10
  },
  followBtn: {
    
  },
});
