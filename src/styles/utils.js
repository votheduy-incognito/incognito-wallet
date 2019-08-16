import { Dimensions } from 'react-native';

const deviceWidth = () => Dimensions.get('screen').width;

const deviceHeight = () => Dimensions.get('screen').height;

export default {
  deviceWidth,
  deviceHeight,
};
