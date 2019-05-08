import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

const style = StyleSheet.create({
  exportBtn: {
    marginBottom: 30,
  },
  removeBtn: {
    backgroundColor: COLORS.transparent,
  },
  removeBtnText: {
    color: COLORS.red
  }
});

export default style;