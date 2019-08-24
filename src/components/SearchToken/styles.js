import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

export const itemStyle = StyleSheet.create({
  container: {
    paddingVertical: 15,
    marginHorizontal: 15,
    marginBottom: 5,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey6
  },
  highlight: {
    ...FONT.STYLE.medium,
    color: COLORS.primary,
  },
});

export const searchPTokenStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  searchInput: {
    marginBottom: 10
  },
  listToken: {
    marginBottom: 10,
  },
  followBtn: {
    
  },
});
