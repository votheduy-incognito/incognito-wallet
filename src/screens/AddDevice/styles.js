import { StyleSheet } from 'react-native';
import TextStyle, { scaleInApp, FontStyle } from '@src/styles/TextStyle';
import { imagesVector } from '@src/assets';

export const iconWifi = imagesVector.ic_wifi({size:scaleInApp(18),containerStyle:{alignSelf:'flex-start'}});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F5',
    flexDirection: 'column'
  },
  group1:{
    backgroundColor:'#FFFFFF',
    borderWidth:scaleInApp(1),
    borderColor:'#E6E7E8',
    padding:scaleInApp(20),
    marginBottom:scaleInApp(10)
  },
  group2:{
    backgroundColor:'#FFFFFF',
    borderWidth:scaleInApp(1),
    borderColor:'#E6E7E8',
    padding:scaleInApp(20),
  },
  group1_listitem:{
    padding:0,
    marginTop:scaleInApp(15),
  },
  group2_listitem:{
    padding:0
  },
  textLabelWifi:{
    ...TextStyle.normalText,
    color: '#737677',
  },
  textTitleWifi:{
    ...TextStyle.bigText,
    ...FontStyle.medium,
    
    fontWeight:'bold',
    color: '#000000',
  },
  textEnterPass:{
    ...TextStyle.normalText,
    marginTop:scaleInApp(5),
    color: '#25CDD6',
  },
  group2_title:{
    ...TextStyle.normalText,
    fontSize:scaleInApp(15),
    color: '#1C1C1C',
  },
  groupWaiting: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flex:1
  },
  containerPrinter: {},
  containerPrinterTop: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  buttonDone: {
    width: '35%'
  },
  checkBoxContent: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginLeft: 0,
    marginRight: 0,
    padding: 0
  },
  labelList: {
    fontWeight: 'bold'
  },
  textEmail: {
    color: '#A3A3A3',
    fontWeight: 'normal'
  }
});

export default styles;
