import { COLORS } from '@src/styles';
import TextStyle, { scaleInApp, screenSize } from '@src/styles/TextStyle';
import { StyleSheet } from 'react-native';

const FLAG_SIZE = 14;

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    position:'absolute',
    flex:1,
    width:screenSize.width,
    height:'100%',
    padding:scaleInApp(15),
    backgroundColor:'white',
  },
  button: {
    marginVertical:scaleInApp(20),
  },
  verifiedFlagContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    width: FLAG_SIZE,
    height: FLAG_SIZE,
    borderRadius: FLAG_SIZE,
    marginLeft: 4
  },
  row: {
    marginVertical:scaleInApp(3)
  },
  textTitle: {
    ...TextStyle.bigText,
    color:'black',
    fontWeight:'500'
  },
  text: {
    ...TextStyle.mediumText,
    
    color:'black'
  },
  bold: {
    ...TextStyle.mediumText,
    color:'black',
    fontWeight:'500'
  },
});
