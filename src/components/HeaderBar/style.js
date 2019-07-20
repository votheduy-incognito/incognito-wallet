import { StyleSheet } from 'react-native';
import { scaleInApp } from '@src/styles/TextStyle';

export const sizeHeader ={
  height:scaleInApp(90),
  width:'100%'
}; 
const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    height: 60,
    borderBottomWidth: 0,
    paddingHorizontal: 20
  },
  bg: {},
  containerText: {
    flex: 1,
    width: '50%',
    alignSelf: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  text: {
    color: 'black',
    fontWeight: '900'
  },
  bt_left_right: {
    width: 30,
    height: 30
  }
});
export default styles;
