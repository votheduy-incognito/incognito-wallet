import { COLORS, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  closeBtn: {
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  container: {
    flex: 1,
    paddingTop: 0
  },
  header: {
    alignItems: 'center',
    backgroundColor: COLORS.transparent,
    flexDirection: 'row',
    height: THEME.modal.headerHeight,
    justifyContent: 'flex-end'
  }
});
