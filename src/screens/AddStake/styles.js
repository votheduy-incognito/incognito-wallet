import { StyleSheet } from 'react-native';
import TextStyle, { scaleInApp, FontStyle } from '@src/styles/TextStyle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  group:{
    flex: 0.75,
    alignSelf:'center',
    flexDirection: 'column'
  },
  label:{
    ...TextStyle.normalText,
    ...FontStyle.medium,
    color: '#000000',
  },
  errorText:{
    ...TextStyle.normalText,
    color: 'red',
  },
  button:{
    backgroundColor:'#0ECBEE',
    padding:scaleInApp(10),
    marginTop:scaleInApp(20),
    borderRadius:scaleInApp(4)
  },
  button_text:{
    ...TextStyle.bigText,
    ...FontStyle.medium,
    color: '#FFFFFF',
  },
  input:{
    ...FontStyle.medium,
    fontSize:scaleInApp(20),
    color: '#000000',
    width: '100%',
    borderColor:'#0DB8D8',
    borderBottomWidth:1
  }
});

export default styles;
