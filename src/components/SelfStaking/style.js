import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  stakeSelector: {
    marginVertical: 50,
  },
  estFee: {
    marginBottom: 10
  },
  stakeButton: {
    marginBottom: 20
  },
  feeText: {
    marginBottom: 38,
    textAlign: 'center',
    fontSize: 14
  },
  selectFunder: {

  },
  selectFunderLabel: {
    fontSize: 18
  },
  selectFunderPicker: {},
  selectFunderErrText: {
    color: COLORS.red,
    fontSize: 14
  },
});
