import { StyleSheet } from 'react-native';
import { THEME, FONT, COLORS } from '@src/styles';
import TextStyle from '@src/styles/TextStyle';

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    backgroundColor: COLORS.white
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    marginTop: 20,
  },
  btn: {
    width: '50%',
    alignItems: 'center',
  },
  btn2: {
    width: '33%',
    alignItems: 'center',
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
    marginTop: 20,
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
    width: 75,
    backgroundColor: COLORS.primary,
    height: 65,
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
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: COLORS.white,
    ...FONT.STYLE.medium,
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
    alignItems: 'center',
  },
  headerTitleText: {
    ...TextStyle.bigText,
    ...FONT.STYLE.bold,
    color: COLORS.white,
  }
});

export default style;
