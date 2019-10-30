import { StyleSheet } from 'react-native';
import TextStyle, { scaleInApp, FontStyle } from '@src/styles/TextStyle';
import { COLORS } from '@src/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: scaleInApp(20)
  },
  item: {
    marginTop: scaleInApp(20)
  },
  textInput: {
    ...TextStyle.mediumText,
    borderColor: '#E5E9EA',
    color:'#1C1C1C',
    borderBottomWidth: scaleInApp(2),
    paddingVertical: scaleInApp(10)
  },
  errorText: {
    ...TextStyle.smallText,
    color: COLORS.errorMessage,
    marginTop: 10
  },
  modal: {
  },
  button:{
    backgroundColor:'#25CDD6',
    padding:scaleInApp(10),
    borderRadius:scaleInApp(4),
    marginTop:scaleInApp(20),
  },
  textTitleButton:{
    ...TextStyle.bigText,
    ...FontStyle.medium,
    color:'#FFFFFF'
  },
  textTitleInputName:{
    ...TextStyle.normalText,
    ...FontStyle.medium,
    color:'#737677'
  },
  modal3: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: scaleInApp(20)
  }
});

export default styles;
