import { StyleSheet } from 'react-native';
import TextStyle, { scaleInApp,FontStyle } from '@src/styles/TextStyle';

const style = StyleSheet.create({
  container: {
    flex:1,
    paddingHorizontal:scaleInApp(15),
    paddingVertical:scaleInApp(18),
    alignItems:'center',
    flexDirection:'row',
    backgroundColor: 'rgba(255,255,255,1)',
    shadowOffset: {
      height: scaleInApp(2),
      width: 0
    },
    shadowColor: 'rgba(227,227,227,1)',
    shadowOpacity: 0.5,
    shadowRadius: scaleInApp(10),
    borderRadius:scaleInApp(7)
  },
  imageLogo:{
    width:scaleInApp(40),
    height:scaleInApp(40),
  },
  groupRight_title:{
    ...TextStyle.normalText,
    backgroundColor: 'transparent',
    'letterSpacing':0,
    color: '#0DB8D8',
  },
  groupLeft:{
    flexDirection:'column',
    flex:1,
    marginLeft:scaleInApp(10)
  },
  groupLeft_title:{
    ...TextStyle.normalText,
    ...FontStyle.medium,
    backgroundColor: 'transparent',
    'letterSpacing':0,
    color: 'rgba(0,0,0,1)',
  },
  groupLeft_title2:{
    ...TextStyle.normalText,
    backgroundColor: 'transparent',
    color: '#899092',
    'letterSpacing':0,
  },
});

export default style;
