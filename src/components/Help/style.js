import { FONT} from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  dialog: {
    padding: 0,
    height: 'auto',
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    ...FONT.STYLE.medium,
  },
  closeIcon: {
    marginLeft: 'auto',
  },
  content: {
    paddingBottom: 25,
    paddingHorizontal: 25,
    maxHeight: 300,
  },
  icon: {
    marginLeft: 6,
  },
  wrapperButton: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});
