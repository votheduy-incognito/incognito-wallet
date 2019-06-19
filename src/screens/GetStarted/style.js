import { StyleSheet } from 'react-native';
import { COLORS, SPACING } from '@src/styles';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
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
    color: COLORS.black,
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
  }
});