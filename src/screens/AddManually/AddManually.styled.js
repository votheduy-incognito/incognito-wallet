import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
  },
  selectNetworkButtonLabel: {
    fontSize: 14,
    letterSpacing: 0,
    backgroundColor: 'pink',
  },
  selectNetworkButton: {
    paddingVertical: 4,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectNetworkValue: {
    fontSize: 16,
    letterSpacing: 0,
  },
  selectNetworkValueIcon: {},
  typesContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
  text: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
  },
  boldText: {
    fontFamily: FONT.NAME.medium,
  },
});
