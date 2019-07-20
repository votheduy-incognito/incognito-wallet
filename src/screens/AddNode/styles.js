import { StyleSheet } from 'react-native';
import TextStyle from '@src/styles/TextStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#041B1E',
    flexDirection: 'row',
  },
  container_list_action:{
    alignSelf:'center',
    flex:1,
    flexDirection:'column',
    backgroundColor:'transparent'
  },
  title: {
    ...TextStyle.normalText,
    color: 'white'
  },
  item_container:{
    width:'50%',
    alignSelf:'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 0
  }
});

export default styles;
