import { COLORS, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textRight: {
    textAlign: 'right',
    marginLeft: 'auto',
  },
  history: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey5,
  },
  historyType: {
    color: COLORS.dark1,
    marginBottom: 5,
  },
  shortDesc: {
    color: COLORS.lightGrey9,
    flex: 1,
    fontSize: 15,
  },
  icon: {
    marginLeft: 10,
  },
  successful: {
    color: COLORS.primary,
  },
  refunded: {
    color: COLORS.orange,
  },
  unsuccessful: {
    color: COLORS.dark1,
  },
  error: {
    color: COLORS.red,
  },
  shortInfo: {
    flex: 1,
  },
  historyStatus: {
    width: 130,
  },
  lastItem: {
    borderBottomWidth: 0,
  }
});
