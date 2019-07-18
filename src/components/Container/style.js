import { StyleSheet,Image } from 'react-native';
import images from '@src/assets';
import { screenSize } from '@src/styles/TextStyle';

const sizeImageTop = Image.resolveAssetSource(images.bgTop);
// const sizzeImageInScreen = {
//   height: screenSize.height/3,
//   width: sizeImageTop.width *(screenSize.height/3) /sizeImageTop.height
// };
const sizeImageInScreen = {
  width: screenSize.width,
  height: sizeImageTop.height *(screenSize.width) /sizeImageTop.width
};
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
    paddingHorizontal: 20
  },
  bgTop:{
    position: 'absolute',
    top:screenSize.height*2.5/6 - sizeImageInScreen.height ,
    ...sizeImageInScreen
  }
});
export default styles;
