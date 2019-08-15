import { FONT, COLORS, DECOR } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrey6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
    borderRadius: DECOR.borderRadiusBorder
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2
  },
  itemContainer: {
    marginVertical: 10
  },
  amountText: {
    flex: 1,
    textAlign: 'left',
    color: COLORS.lightGrey3
  },
  typeText: {
    flex: 1,
    color: COLORS.dark1,
  },
  statusText: {
    flex: 1,
    fontSize: FONT.SIZE.small,
    textAlign: 'right'
  },
  timeText: {
    flex: 1,
    textAlign: 'right',
    color: COLORS.lightGrey3
  },
  noHistoryContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 30
  },
  noHistoryText: {
    ...FONT.STYLE.medium,
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 40,
  },
  noHistoryActionButton: {
    width: 200
  }
});

export default style;
