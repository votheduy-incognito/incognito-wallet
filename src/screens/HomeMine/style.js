import { StyleSheet } from 'react-native';
import TextStyle, { scaleInApp, FontStyle, screenSize } from '@src/styles/TextStyle';
import { sizeHeader } from '@src/components/HeaderBar/style';
import { limitRatioImageTop } from '@src/components/Container/style';

// const marginTopList = screenSize.height * limitRatioImageTop - scaleInApp(30);
const marginTopList = screenSize.height/3;
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  container_first_app:{
    flex: 1,
    flexDirection:'row',
    justifyContent:'center',
    backgroundColor: 'transparent'
  },
  group_first_open:{
    width:'100%',
    paddingHorizontal:scaleInApp(20),
    marginBottom:scaleInApp(20),
    alignSelf:'flex-end',
  },
  group_first_open_text01:{
    textAlign:'center',
    ...TextStyle.bigText,
    color: '#101111',
  },
  group_first_open_text02:{
    ...TextStyle.normalText,
    marginBottom:scaleInApp(20),
    textAlign:'center',
    color: '#8C9A9D',
  },
  titleHeader:{
    ...TextStyle.bigText,
    color: '#007280',
    fontWeight: 'bold',
  },
  header2:{
    ...TextStyle.normalText,
    color: '#293D40',
    marginTop: scaleInApp(10),
    alignSelf: 'center',
  },
  header3:{
    ...TextStyle.xxExtraText,
    ...FontStyle.medium,
    color: '#1C1C1C',
    alignSelf: 'center',
    marginTop: scaleInApp(4)
  },
  header3_child:{
    ...TextStyle.smallText,
    ...FontStyle.medium,
    color: '#1C1C1C',
  },
  list:{
    flex:1,
    alignSelf:'center',
    backgroundColor:'transparent',
    position:'absolute',
    width:screenSize.width - 2*scaleInApp(20),
    height:'100%',
    top:marginTopList
  },
  containerHeader:{
    backgroundColor: 'transparent',
    height:sizeHeader.height,
    alignItems:'flex-start',
    marginLeft:0,
    marginRight:0,
    marginHorizontal:0,
    marginVertical:0,
    borderBottomColor: 'transparent'
  },
  itemList:{
    marginVertical:scaleInApp(3),
  },
  button:{
    backgroundColor:'#25CDD6',
    padding:scaleInApp(10),
    borderRadius:scaleInApp(4),
    marginTop:scaleInApp(10),
  },
  textTitleButton:{
    ...TextStyle.normalText,
    color:'#FFFFFF'
  },
});

export default style;
