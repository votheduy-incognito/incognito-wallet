import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';
import { scaleInApp } from '@src/styles/TextStyle';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  stakeSelector: {
    marginVertical: scaleInApp(20),
  },
  estFee: {
    marginTop: scaleInApp(10),
    marginBottom: scaleInApp(10)
  },
  stakeButton: {
    marginBottom: scaleInApp(20)
  },
  feeText: {
    marginBottom: scaleInApp(38),
    textAlign: 'center',
    fontSize: 14
  },
  notEnoughPRVContainer: {
    alignItems: 'center',
    marginTop: 50
  },
  notEnoughPRVText: {
    ...FONT.STYLE.medium,
    fontSize: 25,
    marginTop: 20,
  },
  notEnoughPRVImg: {}
});
