import { COLORS, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  closeBtn: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    position: 'absolute',
    left: 10,
  },
  container: {
    flex: 1,
    paddingTop: 0,
  },
  containerSafeView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: THEME.modal.headerHeight,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    marginHorizontal: 60,
    color: COLORS.white
  }
});
