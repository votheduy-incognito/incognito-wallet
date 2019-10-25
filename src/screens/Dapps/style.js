import { COLORS, THEME } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    width: '100%',
    flexDirection: 'row',
    flex: 1
  },
  input: {
    flex: 1,
    marginRight: 20,
  },
  submitBtn: {
    backgroundColor: COLORS.blue,
    minWidth: 100
  },
  controlContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  navigateGroup: {
    flexDirection: 'row',
    marginRight: 20,
  },
  urlText: {
    flex: 1,
    borderBottomColor: COLORS.lightGrey3,
    borderBottomWidth: 1
  },
  btnGroup: {
    flexDirection: 'row',
    marginLeft: 20
  },
  controlBtn: {
    fontSize: 40,
    marginRight: 30,
  }
});

export default style;
