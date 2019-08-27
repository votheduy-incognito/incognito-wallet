import { StyleSheet } from 'react-native';
import { COLORS, THEME, DECOR } from '@src/styles';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  getStartedBlock: {
    marginTop: 30,
    justifyContent: 'center',
    width: '100%',
  },
  getStartedBtn: {
    marginVertical: 30
  },
  title: {
    fontSize: 20,
    marginBottom: 20
  },
  importKeyBlock: {
    height: 130,
  },
  centerText: {
    textAlign: 'center'
  },
  importBtn: {
    color: COLORS.blue,
    marginVertical: 20
  },
  errorMsg: {
    ...THEME.text.errorText,
    fontSize: 14,
  },
  retryBtn: {
    marginTop: 50,
  },
  bar: {
    width: '100%',
    height: 5,
    backgroundColor: COLORS.lightGrey6,
    borderRadius: DECOR.borderRadiusBorder
  },
  barHighlight: {
    position: 'relative',
    left: 0,
    width: 100,
    height: 5,
    backgroundColor: COLORS.primary,
    borderRadius: DECOR.borderRadiusBorder
  }
});