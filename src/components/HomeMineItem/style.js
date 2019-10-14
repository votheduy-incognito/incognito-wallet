import { StyleSheet } from 'react-native';
import TextStyle, { scaleInApp,FontStyle } from '@src/styles/TextStyle';
import {DECOR} from "@src/styles";

const style = StyleSheet.create({
  container: {
    flex:1,
    paddingHorizontal:scaleInApp(15),
    paddingVertical:scaleInApp(18),
    alignItems:'center',
    flexDirection:'row',
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: 'rgba(227,227,227,1)',
    shadowOpacity: 0.5,
    shadowRadius: scaleInApp(10),
    borderRadius: DECOR.borderRadiusBorder,
    shadowOffset: { width: 2, height: 0 },
    elevation: 3,
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
    marginBottom: 2,
  },
  groupLeft_title2:{
    ...TextStyle.normalText,
    backgroundColor: 'transparent',
    color: '#899092',
    'letterSpacing':0,
  },
  earning: {
    marginTop: 8,
    marginLeft: 18,
  }
});

export default style;
