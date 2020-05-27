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
    marginTop: 15,
  },
  verifyInfoHeader: {
    flexDirection: 'row',
  },
  verifyInfoLabel: {
    fontSize: FONT.SIZE.small + 2,
    fontFamily: FONT.NAME.regular,
    lineHeight: FONT.SIZE.small + 6,
    color: COLORS.colorGreyMedium,
    flex: 1,
    marginLeft: 10,
  },
  block: {
    marginTop: 30,
  },
  desc: {
    marginBottom: 10,
  },
  input: {
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 4,
  },
  labelInput: {
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 4,
    fontFamily: FONT.NAME.bold,
  },
  descriptionInput: {
    height: 80,
  },
  submitBtn: {
    marginVertical: 50,
    borderRadius: 100,
    backgroundColor: COLORS.orange,
    height: 50,
  },
  submitBtnDisabed: {
    opacity: 0.5,
  },
  title: {
    fontSize: THEME.text.largeTitleSize,
    fontWeight: 'bold',
  },
  balance: {
    textAlign: 'center',
  },
  error: {
    color: COLORS.red,
    fontSize: FONT.SIZE.small,
  },
  showMyAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  showMyAddressLabel: {
    flex: 1,
    fontFamily: FONT.NAME.bold,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 4,
    color: COLORS.black,
  },
  switch: {
    height: '100%',
    marginBottom: 0,
  },
});

export default style;
