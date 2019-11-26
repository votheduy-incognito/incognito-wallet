import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  recentHistory: {
    marginTop: 20,
  },
  container: {
    flex: 1,
  },
  listContainer: {
    marginTop: 40,
  },
  wrapper: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    paddingVertical: 15,
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey5,
    ...FONT.STYLE.medium,
  },
  viewHistoryText: {
    textAlign: 'center',
    color: COLORS.primary,
    paddingVertical: 5,
    ...FONT.STYLE.medium,
  },
});
