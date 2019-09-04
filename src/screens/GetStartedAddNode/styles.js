import { StyleSheet,Image } from 'react-native';
import TextStyle, { scaleInApp, FontStyle } from '@src/styles/TextStyle';
import images from '@src/assets';

const sizeImage = Image.resolveAssetSource(images.ic_getstarted_device);
const scale = 0.7;
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
  errorText:{
    ...TextStyle.minimizeText,
    textAlign:'center',
    color:'#FF9494',
  },
  title1:{
    ...TextStyle.minimizeText,
    ...FontStyle.medium,
    color:'#101111',
    marginVertical:scaleInApp(10),
    textAlign:'center',
  },
  title2:{
    marginVertical:scaleInApp(10),
    ...TextStyle.bigText,
    ...FontStyle.medium,
    width:'75%',
    alignSelf:'center',
    color:'#101111',
    textAlign:'center',
  },
  content:{
    margin:scaleInApp(20),
    flex:1,
    justifyContent:'center',
    flexDirection:'column'
  },
  content_step1_image:{
    alignSelf:'center',
    width:sizeImage.width*scale,
    height:sizeImage.height*scale
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
  item_container_input:{
    borderBottomColor: '#E5E9EA',
    borderBottomWidth: scaleInApp(1)
  },
  text: {
    ...TextStyle.normalText,
    color:'#1C1C1C',
  },
  item_container_error:{
    borderBottomColor: '#E5E9EA',
    borderBottomWidth: scaleInApp(1),
    paddingVertical:scaleInApp(10),
  }
});

export default styles;
