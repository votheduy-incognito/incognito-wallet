import { COLORS } from '@src/styles';
import TextStyle, { screenSize, STATUSBAR_HEIGHT } from '@src/styles/TextStyle';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flexDirection: 'column',
    position: 'absolute',
    width:screenSize.width-10,
    
    top:2*STATUSBAR_HEIGHT,
    margin:5,
    maxHeight: screenSize.height*2/3,
    borderRadius: 4,
  },
  textTitle:{
    ...TextStyle.mediumText,
    textAlign:'right',
    fontWeight:'bold',
    color: COLORS.white,
  },
  showContainer: {
    opacity: 1,flex:1,
  },
  hideContainer: {
    opacity: 0,width: 0,height: 0
  },
});

export default style;
