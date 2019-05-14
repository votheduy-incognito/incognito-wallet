import { StyleSheet } from 'react-native';
import { THEME, COLORS } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  header: {
    height: THEME.modal.headerHeight,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: COLORS.transparent
  },
  closeBtn: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  }
});
