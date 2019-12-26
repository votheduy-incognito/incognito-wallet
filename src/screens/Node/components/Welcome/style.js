import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

const style = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    ...FONT.STYLE.medium,
  },
  pNode: {
    padding: 25,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    elevation: 2,
  }
});

export default style;
