import { Dimensions } from 'react-native';

const deviceWidth = () => Dimensions.get('screen').width;

const deviceHeight = () => Dimensions.get('screen').height;

const minWidth = (pixel, screenPercentage = 1) => {
  if (typeof pixel === 'number') {
    return Math.min(deviceWidth() * screenPercentage, pixel);
  } 
  throw new TypeError('Pixel must be a number');
};

export default {
  deviceWidth,
  deviceHeight,
  minWidth
};