import images from '@src/assets';
import { calculateTopBgImage, limitRatioImageTop } from '@src/components/Container/style';
import { sizeHeader } from '@src/components/HeaderBar/style';
import TextStyle, { FontStyle, scaleInApp, screenSize } from '@src/styles/TextStyle';
import { Image, StyleSheet } from 'react-native';

const sizeImageDevice = Image.resolveAssetSource(images.bg_top_device);
const sizeBackgroundImage = Image.resolveAssetSource(images.bg_top_detail);
const styleBackgroundImage = calculateTopBgImage(sizeBackgroundImage);

const posImageDevice = {
  top:screenSize.height * limitRatioImageTop - sizeImageDevice.height - sizeHeader.height
};
const boxGroup = {
  backgroundColor: 'rgba(255,255,255,1)',
  borderRadius: scaleInApp(8),
  shadowOffset: {
    height: 2,
    width: 0
  },
  shadowColor: 'rgba(208,208,208,0.5)',
  shadowOpacity: 1,
  marginHorizontal: scaleInApp(15),
  shadowRadius: 1.2};
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f5f5'
  },
  containerHeader:{
    backgroundColor: 'transparent',
    height:sizeHeader.height,
    alignItems:'flex-start',
    marginLeft:0,
    marginRight:0,
    paddingHorizontal:0,
    paddingVertical:0,
    marginHorizontal:0,
    marginVertical:0,
    borderBottomColor: 'transparent'
  },
  imageTop:{
    ...styleBackgroundImage,
    top:styleBackgroundImage.top - sizeImageDevice.height * 1/3
  },
  titleHeader:{
    ...TextStyle.bigText,
    ...FontStyle.medium,
    color: '#FFFFFF',
  },
  bg_top:{
    marginTop:posImageDevice.top,
    alignSelf:'center'
  },
  top_button_action:{
    width:scaleInApp(40),
    height:scaleInApp(40),
    backgroundColor:'white',
    borderRadius:scaleInApp(20),
    shadowOffset: {
      height: 1,
      width: 0
    },
    borderWidth:0,
    shadowColor: '#BFBFBF',
    shadowOpacity: 0.6,
    shadowRadius: 2.62,
  },
  top_container:{
    flexDirection:'row',
    borderBottomWidth: 0,
    backgroundColor: 'rgba(243,248,249,0.73)',
    marginVertical:scaleInApp(5),
    padding:scaleInApp(10),
    alignItems:'center',
    shadowOffset: { width: 2, height: 0 },
    borderRadius: 6,
    elevation: 3,
    ...boxGroup
  },
  top_right_container:{
  },
  advance_text:{
    ...TextStyle.mediumText,
    color: '#25CDD6',
    textDecorationLine:'underline'
  },
  top_container_group:{
    flex:1,
    justifyContent:'space-evenly',
    paddingHorizontal:scaleInApp(10),
  },
  top_container_title:{
    ...TextStyle.mediumText,
    ...FontStyle.normal,
    color: '#000000',
    fontSize: 15,
  },
  top_container_subtitle:{
    ...TextStyle.mediumText,
    marginTop: scaleInApp(5),
    color: 'rgba(137,144,146,1)',
  },
  textWarning:{
    ...TextStyle.smallText,
    alignSelf:'center',
    textAlign:'left',
    color: '#FF8E00',
  },
  group2_container:{
    flexDirection:'column',
    justifyContent:'space-around',
    borderBottomWidth: 0,
    marginVertical:scaleInApp(5),
    padding:scaleInApp(10),
    shadowOffset: { width: 2, height: 0 },
    borderRadius: 6,
    elevation: 3,
    ...boxGroup
  },
  group2_container_group1:{
    flexDirection:'row',
    justifyContent:'space-around',
  },
  group2_container_container:{
    flex:2,
    justifyContent:'center',
    padding:scaleInApp(10),
  },
  group2_container_title:{
    ...TextStyle.mediumText,
    ...FontStyle.medium,
    color: '#000000',
  },
  group2_container_value:{
    ...TextStyle.mediumText,
    marginTop:scaleInApp(2),
    color: '#1C1C1C',
  },
  group2_container_button:{
    backgroundColor:'#25CDD6',
    marginHorizontal:scaleInApp(10),
    paddingHorizontal:scaleInApp(30),
    borderRadius:scaleInApp(4)
  },
  group2_container_container2:{
    flex:1,
    justifyContent:'center',
    padding:scaleInApp(10),
  },
  group2_container_title2:{
    ...TextStyle.minimizeText,
    color: '#899092',
  },
  group2_container_value2:{
    ...TextStyle.smallText,
    fontSize:scaleInApp(14),
    marginTop:scaleInApp(2),
    color: '#00C7E2',
  },
  group2_container_button2:{
    backgroundColor:'#26C64D',
    padding:scaleInApp(7),
    borderRadius:scaleInApp(6)
  },
  group2_container_button_text:{
    ...TextStyle.normalText,
    ...FontStyle.medium,
    color: '#FFFFFF',
  },
  dialog_title_text: {
    ...TextStyle.bigText,
    ...FontStyle.medium,
    alignSelf:'center',
    color:'#1C1C1C',
  },
  dialog_content_text: {
    ...TextStyle.normalText,
    color:'#1C1C1C',
    textAlignVertical:'center',
    textAlign:'center',
    paddingHorizontal: 5,
  },
  dialog_content: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  dialog_container:{
    flex:1,
    paddingVertical:scaleInApp(20),
    paddingHorizontal:scaleInApp(30),
  },
  dialog_button:{
    backgroundColor:'#25CDD6',
    borderRadius:scaleInApp(4),
    padding:scaleInApp(10)
  },
  textTitleButton:{
    ...TextStyle.mediumText,
    ...FontStyle.medium,
    color:'#FFFFFF'
  },
});

export default style;
