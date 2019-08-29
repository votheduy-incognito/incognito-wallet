import {StyleSheet} from 'react-native';
import { scaleInApp } from '@src/styles/TextStyle';

export const indicatorStyles = {
  stepIndicatorSize: scaleInApp(30),
  currentStepIndicatorSize: scaleInApp(40),
  separatorStrokeWidth: scaleInApp(1),
  currentStepStrokeWidth: scaleInApp(3),
  separatorFinishedColor: '#25CDD6',
  separatorUnFinishedColor: '#a4d4a5',
  stepIndicatorFinishedColor: '#25CDD6',
  stepIndicatorUnFinishedColor: '#a4d4a5',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: scaleInApp(15),
  currentStepIndicatorLabelFontSize: scaleInApp(15),
  stepIndicatorLabelCurrentColor: '#000000',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
  labelColor: '#666666',
  labelSize: scaleInApp(12),
  currentStepLabelColor: '#4aae4f'
};

const style = StyleSheet.create({
  container:{
    flexDirection:'column'
  }
});
export default style;