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
  balance: {
    color: COLORS.white,
    fontSize: 28,
    textAlign: 'center',
    letterSpacing: 0,
    ...FONT.STYLE.medium
  },
  boxBalance: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 42,
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
    maxWidth: 116,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    shadowOffset: { width: 2, height: 0 },
    borderRadius: 6,
    elevation: 3,
    marginHorizontal: 3,
    marginVertical: 3,
    height: 80
  },
  actionButtonIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginBottom: 7,
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
  }
});

export default style;
