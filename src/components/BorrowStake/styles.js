import { StyleSheet } from 'react-native';
import TextStyle, { scaleInApp, FontStyle } from '@src/styles/TextStyle';

export const tab_border_radius = scaleInApp(4);
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    padding:scaleInApp(10)
  },
  fields: {
    flex: 1,
  },
  group:{
    flex: 1,
    padding:scaleInApp(20),
    flexDirection: 'column'
  },
  tab_button:{
    borderWidth:0,
    backgroundColor:'#F0F5F5',
  },
  tab_container:{
    borderWidth:0,
    backgroundColor:'#FFFFFF',
    borderRadius:tab_border_radius,
    height: scaleInApp(44)
  },
  tab_text:{
    ...TextStyle.mediumText,
    color:'#8C9C9D'
  },
  tab_text_selected:{
    ...TextStyle.mediumText,
    color:'#FFFFFF'
  },
  tab_button_selected:{
    backgroundColor:'#25CDD6'
  },
  label:{
    ...TextStyle.bigText,
    textAlign:'center',
    textAlignVertical:'center',
    marginTop:scaleInApp(20),
    color: '#101111',
  },
  errorText:{
    ...TextStyle.normalText,
    color: 'red',
  },
  button:{
    backgroundColor:'#25CDD6',
    padding:scaleInApp(10),
    marginTop:scaleInApp(20),
    borderRadius:scaleInApp(4)
  },
  button_text:{
    ...TextStyle.bigText,
    ...FontStyle.medium,
    color: '#FFFFFF',
  },
  input_container:{
    height:scaleInApp(50)
  },
  input:{
    ...FontStyle.medium,
    fontSize:scaleInApp(20),
    color: '#000000',
    width: '100%',
    borderColor:'#0DB8D8',
    borderBottomWidth:0
  }
});

export default styles;
