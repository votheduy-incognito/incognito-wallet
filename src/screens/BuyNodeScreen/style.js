import { COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';
import { ScreenWidth } from '@src/utils/devices';

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  backBtn: {
    bottom: 10,
    right: 10,
    width: 50,
    height: 50,
    position: 'absolute',
    backgroundColor: COLORS.lightGrey5,
    opacity: 0.5,
    borderRadius: 50,
    padding: 15,
  },
  loading: {
    position: 'absolute',
    left: '50%',
    right: '50%',
    top: '50%',
    bottom: '50%',
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center'
  },
  iconDropDown: {
    alignSelf: 'center', 
    justifyContent: 'center', 
    height: 50,
    marginEnd: 10
  }
});

export default style;
