import { Dimensions } from 'react-native';

const deviceWidth = () => Dimensions.get('screen').width;

const deviceHeight = () => Dimensions.get('screen').height;

const screenHeight = () => Math.round(Dimensions.get('window').height);

const screenWidth = () => Math.round(Dimensions.get('window').width);

export default {
  deviceWidth,
  deviceHeight,
  screenHeight,
  screenWidth,
};
