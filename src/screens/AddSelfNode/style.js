import { StyleSheet } from 'react-native';
import TextStyle, { scaleInApp, FontStyle } from '@src/styles/TextStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: scaleInApp(20)
  },
  item: {
    marginTop: scaleInApp(20)
  },
  group_list_account:{
    flex:1,
    flexDirection:'column'
  },
  item_account_text: {
    ...TextStyle.mediumText,
    color:'#1C1C1C',
    paddingVertical: scaleInApp(10)
  },
  textInputPrivateKey:{
    flex:1,
    borderColor:'#E5E9EA',
    textAlignVertical:'top',
    padding: scaleInApp(10),
    borderWidth: scaleInApp(2)
  },
  textInput: {
    ...TextStyle.mediumText,
    borderColor: '#E5E9EA',
    color:'#1C1C1C',
    borderBottomWidth: scaleInApp(2),
    paddingVertical: scaleInApp(10)
  },
  buttonChooseAccount:{
    ...TextStyle.smallText,
    color:'#00bfff',
    textAlign:'right',
    marginTop:scaleInApp(5),
    backgroundColor:'transparent',
    borderColor: '#E5E9EA',
    borderBottomWidth: scaleInApp(2),
  },
  errorText: {
    ...TextStyle.smallText,
    color: 'red',
    marginTop: scaleInApp(8)
  },
  
  button:{
    backgroundColor:'#25CDD6',
    padding:scaleInApp(10),
    borderRadius:scaleInApp(4),
    marginTop:scaleInApp(20),
  },
  textTitleButton:{
    ...TextStyle.bigText,
    ...FontStyle.medium,
    color:'#FFFFFF'
  },
  
  group_host: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  }
});

export default styles;
