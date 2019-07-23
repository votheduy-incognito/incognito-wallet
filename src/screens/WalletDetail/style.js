import { StyleSheet } from 'react-native';
import { THEME, FONT, COLORS } from '@src/styles';

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%'
  },
  boxHeader: { 
    backgroundColor: COLORS.blueDark,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',   
    height: 80,
    paddingBottom: 30,
  },
  historyContainer: {
    flex: 1,
    width: '100%',
  },
  balance: {
    color: COLORS.white,
    fontSize: 28,   
    textAlign: 'center', 
    letterSpacing: 0,
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
  withdrawBtn: {
    backgroundColor: COLORS.blueDark
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
  },
  buttonRow: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default style;