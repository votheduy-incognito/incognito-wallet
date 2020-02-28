import {StyleSheet} from 'react-native';
import {COLORS} from '@src/styles';

const style = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
  },
  btnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 320,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 10,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.lightGrey6,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  btn: {
    width: '33%',
    alignItems: 'center',
  }
});

export default style;
