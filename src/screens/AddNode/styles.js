import TextStyle, { FontStyle, scaleInApp } from '@src/styles/TextStyle';
import { StyleSheet } from 'react-native';

export const rightNextIcon = {
  size:scaleInApp(25), type:'material',
  name:'navigate-next',color:'#C3C8C9',
  containerStyle:{
    alignSelf:'flex-start'
  },iconStyle:{
    
  }};
// export const rightNextIcon = (
//   <Text><Icon
//     size={scaleInApp(25)}
//     type='material'
//     name='navigate-next'
//     color='#C3C8C9'
//   />
//   </Text>
// );
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding:scaleInApp(10),
    flexDirection: 'row',
  },
  container_list_action:{
    flex:1,
    flexDirection:'column',
    backgroundColor:'transparent'
  },
  title: {
    ...FontStyle.medium,
    fontSize:scaleInApp(15),
    color: '#1C1C1C'
  },
  subTitle: {
    ...TextStyle.normalText,
    marginTop:scaleInApp(5),
    lineHeight:scaleInApp(20),
    color: '#9FA4A5'
  },
  item_container:{
    paddingVertical:scaleInApp(10),
    backgroundColor: 'transparent',
  },
  avatar:{
    height:scaleInApp(30),
    width:scaleInApp(30),
    alignSelf:'flex-start',
    marginRight:scaleInApp(10)
  }
});

export default styles;
