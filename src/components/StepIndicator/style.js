import { FontStyle, scaleInApp } from '@src/styles/TextStyle';
import { StyleSheet } from 'react-native';

export const indicatorStyles = {
  stepIndicatorSize: scaleInApp(25),
  currentStepIndicatorSize: scaleInApp(30),
  separatorStrokeWidth: scaleInApp(1),
  currentStepStrokeWidth: scaleInApp(2),
  stepStrokeCurrentColor:'#25CDD6',
  separatorFinishedColor: '#D8D8D8',
  separatorUnFinishedColor: '#D8D8D8',
  stepIndicatorFinishedColor: '#25CDD6',
  stepIndicatorUnFinishedColor: '#014E52',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: scaleInApp(15),
  currentStepIndicatorLabelFontSize: scaleInApp(15),
  stepIndicatorLabelCurrentColor: '#000000',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
  labelColor: '#666666',
  labelSize: scaleInApp(12),
  currentStepLabelColor: '#25CDD6',
  labelFontFamily:FontStyle.medium
};

const style = StyleSheet.create({
  container:{
    flexDirection:'column'
  }
});
export default style;