import { THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    backgroundColor: THEME.divider.color,
    height: THEME.divider.height,
    width: '100%'
  }
});

export default style;
