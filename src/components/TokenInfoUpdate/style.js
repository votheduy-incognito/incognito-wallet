import { FONT, THEME, COLORS } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: 1000,
  },
  form: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
  },
  block: {
    backgroundColor: COLORS.white,
    // paddingVertical: 15,
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
  submitBtn: {
    borderRadius: 4,
    width: 100
  },
  showMyAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  switch: {
    height: '100%',
    marginBottom: 0
  },
  showMyAddressLabel: {
    flex: 1
  },
  btnGroup: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  closeBtn: {
    backgroundColor: COLORS.transparent,
    width: 100,
    borderColor: COLORS.primary
  },
  closeBtnText: {
    color: COLORS.primary
  },
});

export default style;
