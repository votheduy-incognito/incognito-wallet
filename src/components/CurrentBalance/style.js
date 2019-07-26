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
  },
  desc: {
    fontSize: 14,
    color: COLORS.lightGrey3
  }
});

export default style;
