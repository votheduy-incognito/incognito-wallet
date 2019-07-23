import { COLORS, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: THEME.header.headerHeight,
    alignItems: 'center'
  },
  title: {
    color: COLORS.white,
    fontWeight: '600'
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  center: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});

export default style;
