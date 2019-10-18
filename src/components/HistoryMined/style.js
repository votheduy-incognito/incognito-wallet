import TextStyle, { FontStyle, scaleInApp } from '@src/styles/TextStyle';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  // container: {
  //   flex:1,
  //   flexDirection:'row',
  //   padding:scaleInApp(10),
  //   backgroundColor: 'rgba(255,255,255,1)',
  //   borderRadius: scaleInApp(4),
  //   shadowOffset: {
  //     height: 2,
  //     width: 0
  //   },
  //   shadowColor: 'rgba(208,208,208,0.5)',
  //   shadowOpacity: 1,
  //   shadowRadius: 1.2
  // },
  container: {
    flex:1,
    flexDirection:'row',
    // padding:scaleInApp(10),
  },
  list:{
    margin:scaleInApp(10)
  },
  container_item:{
    flexDirection:'row',
    alignItems:'center',
    marginVertical:scaleInApp(7),
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f5f5',
  },
  last_item: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  imageLogo:{
    alignSelf:'center',
    width:scaleInApp(30),
    height:scaleInApp(30),
  },
  withdraw_logo: {
    alignSelf:'center',
    width:scaleInApp(27),
    height:scaleInApp(27),
  },
  groupLeft:{
    flexDirection:'column',
    flex:1,
    justifyContent:'space-between',
    marginLeft:scaleInApp(15),
  },
  groupLeft_title:{
    ...TextStyle.normalText,
    backgroundColor: 'transparent',
    'letterSpacing':0,
    color: 'rgba(0,0,0,1)',
    paddingBottom: 4,
  },
  groupRight:{
    flexDirection:'row',
    alignItems:'center'
  },
  groupRight_title:{
    ...TextStyle.normalText,
    ...FontStyle.medium,
    'letterSpacing':0,
    color: '#000000',
    fontSize: scaleInApp(13),
  },
  groupRight_title2:{
    ...TextStyle.normalText,
    'letterSpacing':0,
    color: '#899092',
    fontSize: scaleInApp(14),
  },
  text_empty:{
    ...TextStyle.normalText,
    'letterSpacing':0,
    textAlign:'center',
    textAlignVertical:'center',
    color: '#8C9C9D',
  }
});

export default style;
