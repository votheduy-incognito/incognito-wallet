import { COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  balance: {
    fontSize: 28,
    color: COLORS.black1,
  },
  desc: {
    fontSize: 16,
    color: COLORS.grey1,
  }
});

export default style;
