import {StyleSheet} from 'react-native';
import {COLORS} from '@src/styles';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
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
  },
  header: {
    flexDirection: 'row',
    alignContent: 'center',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  accTitle: {
    color: COLORS.black
  }
});

export default style;
