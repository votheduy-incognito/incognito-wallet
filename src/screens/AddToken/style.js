import { StyleSheet } from 'react-native';
import { COLORS } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: COLORS.white
  },
  selectNetworkButtonGroup: {
    marginVertical: 29
  },
  selectNetworkButtonLabel: {
    fontSize: 14,
    letterSpacing: 0,
  },
  selectNetworkButton: {
    paddingVertical: 4, 
    marginVertical: 3,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  selectNetworkValue: {
    fontSize: 16,
    letterSpacing: 0,
  },
  selectNetworkValueIcon: {},
  typesContainer: {

  },
  typeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15
  }
});
