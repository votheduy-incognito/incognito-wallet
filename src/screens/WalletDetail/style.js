import { StyleSheet } from 'react-native';
import { THEME, FONT, COLORS } from '@src/styles';

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  boxHeader: { 
    backgroundColor: COLORS.headerColor,
    width: '100%',
    alignItems: 'center',
    padding: 10,
    height: 150,
  },
  historyContainer: {
    flex: 1,
    width: '100%',
  },
  balance: {
    color: COLORS.white,
    fontSize: 28,   
    textAlign: 'center', 
  },
  boxBalance: {
    alignItems: 'center',
    justifyContent: 'center',    
    textAlign: 'center',
  },
  getFree : {
    color: COLORS.blueLight,
    textAlign: 'center',
    fontSize: 16    
  },
  btnStyle: {    
    width: '45%',
    margin: 10
  },
  boxButton : {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  noteText: {
    fontSize: FONT.SIZE.small,
    fontWeight: 'bold',
    marginVertical: 15,    
  },  
  submitBtn: {
    marginTop: 30
  },
  title: {
    fontSize: THEME.text.largeTitleSize,
    fontWeight: 'bold',
  }
});

export default style;