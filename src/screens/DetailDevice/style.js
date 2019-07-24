import { StyleSheet,Image } from 'react-native';
import TextStyle, { scaleInApp, FontStyle, screenSize } from '@src/styles/TextStyle';
import images from '@src/assets';
import { limitRatioImageTop, calculateTopBgImage } from '@src/components/Container/style';
import { sizeHeader } from '@src/components/HeaderBar/style';

const sizeImageDevice = Image.resolveAssetSource(images.bg_top_device);
const sizeBackgroundImage = Image.resolveAssetSource(images.bg_top_detail);
const styleBackgroundImage = calculateTopBgImage(sizeBackgroundImage);

const posImageDevice = {
  top:screenSize.height * limitRatioImageTop - sizeImageDevice.height - sizeHeader.height
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9fa'
  },
  containerHeader:{
    backgroundColor: 'transparent',
    height:sizeHeader.height,
    marginLeft:0,
    marginRight:0,
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
    color: '#FFFFFF',
    fontWeight: 'bold',
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
    borderBottomWidth: 0,
    backgroundColor: 'rgba(243,248,249,0.73)',
    marginHorizontal: scaleInApp(20),
    marginVertical:scaleInApp(5)
  },
  top_container_title:{
    ...TextStyle.bigText,
    ...FontStyle.medium,
    color: '#000000',
  },
  top_container_subtitle:{
    ...TextStyle.mediumText,
    marginTop: scaleInApp(5),
    color: 'rgba(137,144,146,1)',
  },
  group2_container:{
    flexDirection:'row',
    justifyContent:'space-around',
    borderBottomWidth: 0,
    margin: scaleInApp(10),
    padding:scaleInApp(10),
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: scaleInApp(4),
    shadowOffset: {
      height: 2,
      width: 0
    },
    shadowColor: 'rgba(208,208,208,0.5)',
    shadowOpacity: 1,
    shadowRadius: 1.2
  },
  group2_container_container:{
    flex:1,
    padding:scaleInApp(10),
  },
  group2_container_title:{
    ...TextStyle.smallText,
    color: '#899092',
  },
  group2_container_value:{
    ...TextStyle.extraText,
    marginTop:scaleInApp(2),
    color: '#1C1C1C',
  },
  group2_container_button:{
    backgroundColor:'#0ECBEE',
    padding:scaleInApp(10),
    marginTop:scaleInApp(20),
    borderRadius:scaleInApp(4)
  },
  group2_container_container2:{
    flex:1,
    padding:scaleInApp(10),
  },
  group2_container_title2:{
    ...TextStyle.smallText,
    color: '#899092',
  },
  group2_container_value2:{
    ...TextStyle.smallText,
    fontSize:scaleInApp(15),
    marginTop:scaleInApp(2),
    color: '#00C7E2',
  },
  group2_container_button2:{
    backgroundColor:'#0D353C',
    padding:scaleInApp(10),
    marginTop:scaleInApp(20),
    borderRadius:scaleInApp(4)
  },
  group2_container_button_text:{
    ...TextStyle.mediumText,
    color: '#FFFFFF',
  }
});

export default style;
