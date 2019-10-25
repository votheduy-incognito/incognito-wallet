import { COLORS, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    minHeight: 500
  },
  controlContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey6
  },
  navigateGroup: {
    flexDirection: 'row',
    marginRight: 20,
  },
  urlText: {
    flex: 1,
    fontSize: 20
  },
  btnGroup: {
    flexDirection: 'row',
    marginLeft: 20
  },
  controlBtn: {
    paddingHorizontal: 20,
  }
});

export default style;
