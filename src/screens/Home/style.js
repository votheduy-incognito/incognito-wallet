import {StyleSheet, Dimensions} from 'react-native';
import {COLORS} from '@src/styles';

const {width} = Dimensions.get('window');
const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: 'center', 
    flex: 1
  },
  btnContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: width - 40,
    marginLeft: 20,
    marginRight: 20,
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
    paddingEnd: 20,
    paddingLeft: 20,
    justifyContent: 'space-between',
  },
  accTitle: {
    color: COLORS.black
  }
});

export default style;
