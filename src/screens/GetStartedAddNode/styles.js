import { StyleSheet } from 'react-native';
import TextStyle, { scaleInApp, FontStyle } from '@src/styles/TextStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding:scaleInApp(20),
    flexDirection: 'column'
  },
  item: {
    marginVertical: scaleInApp(10)
  },
  title1:{
    ...TextStyle.minimizeText,
    ...FontStyle.medium,
    color:'#101111',
    marginVertical:scaleInApp(10),
    textAlign:'center',
  },
  title2:{
    ...TextStyle.bigText,
    ...FontStyle.medium,
    width:'50%',
    alignSelf:'center',
    lineHeight:scaleInApp(25),
    color:'#101111',
    textAlign:'center',
  },
  content:{
    margin:scaleInApp(20),
    flex:1,
    justifyContent:'center',
    flexDirection:'column'
  },
  content_step1:{
    alignSelf:'center'
  },
  footer:{
    marginVertical:scaleInApp(20),
    flexDirection:'column'
  },
  button:{
    backgroundColor:'#25CDD6',
    padding:scaleInApp(10),
    borderRadius:scaleInApp(4),
  },
  textTitleButton:{
    ...TextStyle.mediumText,
    ...FontStyle.medium,
    color:'#FFFFFF'
  },
  step3_text:{
    ...TextStyle.normalText,
    color:'#101111',
    alignSelf:'center'
  },
  textInput: {
    ...TextStyle.mediumText,
    borderColor: '#E5E9EA',
    color:'#1C1C1C',
    borderBottomWidth: scaleInApp(2),
    paddingVertical: scaleInApp(10)
  },
});

export default styles;
