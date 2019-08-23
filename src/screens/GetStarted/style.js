import { StyleSheet } from 'react-native';
import { COLORS, SPACING, THEME } from '@src/styles';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.small,
  },
  getStartedBlock: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  getStartedBtn: {
    marginVertical: 30
  },
  title: {
    fontSize: 24,
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
  }
});