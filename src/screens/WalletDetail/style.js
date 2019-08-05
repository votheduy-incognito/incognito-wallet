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
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',   
    height: 80,
    paddingBottom: 30,
    backgroundColor: COLORS.primary
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
    textAlign: 'center',
    fontSize: 16    
  },
  btnStyle: {    
    width: '45%',
    margin: 10
  },
  unfollowBtn: {
    
  },
  unfollowText: {
    color: COLORS.primary
  },
  withdrawBtn: {
    backgroundColor: COLORS.dark2
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
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default style;