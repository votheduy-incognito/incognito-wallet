import { StyleSheet,Image } from 'react-native';
import images from '@src/assets';
import { screenSize, scaleInApp } from '@src/styles/TextStyle';

const sizeImageTop = Image.resolveAssetSource(images.bgTop);

export const limitRatioImageTop = 2.5/6;
// export const limitRatioImageTop = 1/3;
export const calculateTopBgImage = (sizeImage={width: 0,height:0})=>{
  let value = {
    top:0,
    width: sizeImage.width,
    height: sizeImage.height
  };
  if(sizeImage.height >0){
    const sizeImageInScreen = {
      width: screenSize.width,
      height: sizeImage.height *(screenSize.width) /sizeImage.width
    };
    const maxHeightScreen = screenSize.height * limitRatioImageTop;
    const top = maxHeightScreen - sizeImageInScreen.height ;
    value.top = top>0?0:top;
    value.width = sizeImageInScreen.width;
    value.height = sizeImageInScreen.height;
    
  }
  return value;
};
const valueForImageBackgoundTop = calculateTopBgImage(sizeImageTop) ;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F4F6F9'
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: 'transparent'
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: scaleInApp(10)
  },
  bgTop:{
    position: 'absolute',
    ...valueForImageBackgoundTop
  }
});
export default styles;
