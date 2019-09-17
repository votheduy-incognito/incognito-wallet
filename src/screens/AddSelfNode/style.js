import TextStyle, { FontStyle, scaleInApp } from '@src/styles/TextStyle';
import { StyleSheet } from 'react-native';

export const placeHolderColor = '#B9C9CA';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: scaleInApp(20)
  },
  item: {
    marginTop: scaleInApp(20)
  },
  item_container_input:{
    borderColor: '#E5E9EA',
    borderBottomWidth: scaleInApp(1),
    // paddingVertical: scaleInApp(10)
  },
  group_list_account:{
    flexDirection:'column'
  },
  item_account_text: {
    ...TextStyle.normalText,
    color:'#1C1C1C',
    paddingVertical: scaleInApp(5)
  },
  textInputPrivateKey:{
    flex:1,
    marginTop: scaleInApp(20),
    borderColor:'#E5E9EA',
    textAlignVertical:'top',
    paddingTop: scaleInApp(15),
    paddingBottom: scaleInApp(15),
    paddingHorizontal:scaleInApp(20),
    borderBottomWidth: scaleInApp(1),
    borderRadius:scaleInApp(4)
  },
  textInput: {
    ...TextStyle.mediumText,
    color:'#1C1C1C',
  },
  buttonChooseAccount:{
    ...TextStyle.smallText,
    color:'#25CDD6',
    textAlign:'right',
    marginTop:scaleInApp(10),
    backgroundColor:'transparent'
  },
  errorText: {
    ...TextStyle.smallText,
    color: 'red',
    marginTop: scaleInApp(8)
  },
  label: {
    ...TextStyle.normalText,
    color: '#8C9C9D'
  },
  button:{
    backgroundColor:'#25CDD6',
    padding:scaleInApp(10),
    borderRadius:scaleInApp(4),
    marginTop:scaleInApp(20),
  },
  textTitleButton:{
    ...TextStyle.mediumText,
    ...FontStyle.medium,
    color:'#FFFFFF'
  },
  
  group_host: {
    backgroundColor: '#FFFFFF',
  },
  dialog_content:{
    paddingVertical:scaleInApp(5),
  }
});

export default styles;
