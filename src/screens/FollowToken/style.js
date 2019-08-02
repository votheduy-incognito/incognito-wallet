import { COLORS, SPACING } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  tabContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 40
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey4,
  },
  tabItemActive: {
    backgroundColor: COLORS.white
  },
  tabContent: {
    flex: 1,
  },
  tabItemTextActive: {
    color: COLORS.primary
  },
});
