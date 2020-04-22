import { FONT, THEME, COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  verifyInfoContainer: {
    marginTop: 25,
  },
  verifyInfoHeader: {
    flexDirection: 'row',
  },
  verifyInfoLabel: {
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 10,
    top: -2,
    // fontStyle: 'italic'
  },
  block: {
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    marginBottom: 10
  },
  desc: {
    marginBottom: 10
  },
  input: {
    marginBottom: 15
  },
  descriptionInput: {
    height: 80,
  },
  noteText: {
    fontSize: FONT.SIZE.small,
    fontWeight: 'bold',
    marginVertical: 15
  },
  submitBtn: {
    marginTop: 40,
    borderRadius: 4,
  },
  title: {
    fontSize: THEME.text.largeTitleSize,
    fontWeight: 'bold'
  },
  balance: {
    textAlign: 'center'
  },
  error: {
    color: COLORS.red,
    fontSize: FONT.SIZE.small,
  },
  showMyAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  showMyAddressLabel: {
    flex: 1
  },
  switch: {
    height: '100%',
    marginBottom: 0
  },
  ownerAddressContainer: {
    alignItems: 'flex-start'
  },
  ownerAddressLabel: {
    marginBottom: 10,
    fontSize: 14
  },
  ownerAddressValue: {
    paddingHorizontal: 1,
    color: COLORS.lightGrey1
  }
});

export default style;
