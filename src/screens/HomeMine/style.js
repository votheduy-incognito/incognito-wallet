import { StyleSheet } from 'react-native';
import TextStyle, { scaleInApp, FontStyle } from '@src/styles/TextStyle';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
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
    ...TextStyle.xxExtraText,
    ...FontStyle.medium,
    color: '#1C1C1C',
  },
  list:{
    flex:1,
    backgroundColor:'transparent',
    marginTop:scaleInApp(50)
  },
  containerHeader:{
    backgroundColor: 'transparent',
    height:scaleInApp(90),
    marginLeft:0,
    marginRight:0,
    marginHorizontal:0,
    marginVertical:0,
    borderBottomColor: 'transparent'
  },
  itemList:{
    marginVertical:scaleInApp(3),
  }
});

export default style;
