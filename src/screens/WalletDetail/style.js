import { StyleSheet } from 'react-native';
import { THEME, FONT, COLORS } from '@src/styles';

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: COLORS.white
  },
  boxHeader: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15,
    backgroundColor: COLORS.primary,
  },
  historyContainer: {
    flex: 1,
    width: '100%',
  },
  balanceContainer: {
    flexDirection: 'row',
    marginHorizontal: 40,
  },
  balance: {
    color: COLORS.white,
    fontSize: 32,
    textAlign: 'center',
    letterSpacing: 0,
    ...FONT.STYLE.medium
  },
  balanceSymbol: {
    color: COLORS.white,
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 0,
    marginLeft: 7,
    ...FONT.STYLE.medium
  },
  boxBalance: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
    height: 35
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
  actionButton: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 100,
    paddingVertical: 12,
    marginHorizontal: 10,
    marginVertical: 3,
  },
  buttonImg: {
    width: 100,
    backgroundColor: COLORS.primary,
    height: 80,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    width: '100%',
    height: 40,
    resizeMode: 'contain',
  },
  buttonText: {
    marginTop: 12,
    textTransform: 'uppercase',
    color: COLORS.white
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
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default style;
