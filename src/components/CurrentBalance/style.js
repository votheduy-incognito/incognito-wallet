import { COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    marginVertical: 15,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  balanceContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  balance: {
    fontSize: 28,
    paddingRight: 5,
  },
  balanceSymbol: {
    fontSize: 28,
  },
  desc: {
    fontSize: 14,
    color: COLORS.lightGrey3
  }
});

export default style;
