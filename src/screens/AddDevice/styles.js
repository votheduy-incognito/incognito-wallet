import { StyleSheet } from 'react-native';
import TextStyle from '@src/styles/TextStyle';

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  containerLocation: {},
  containerPrinter: {},
  containerPrinterTop: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  labelList: {
    ...TextStyle.mediumText,
    fontWeight: 'bold'
  },
  textEmail: {
    ...TextStyle.normalText,
    color: '#A3A3A3',
    fontWeight: 'normal'
  }
});

export default styles;
