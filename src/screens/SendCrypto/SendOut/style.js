import {StyleSheet} from 'react-native';
import {COLORS, FONT} from '@src/styles';

export const receiptStyle = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
  },
  title: {
    fontSize: 20,
    color: COLORS.dark1,
    marginTop: 40,
    ...FONT.STYLE.medium,
  },
  divider: {
    marginVertical: 30,
  },
  backButton: {
    marginTop: 0,
    width: '100%',
  },
  infoContainer: {
    width: '100%',
    marginTop: 10,
  },
  modalContainer: {
    backgroundColor: COLORS.primary,
  },
  rowText: {
    display: 'flex',
    flexDirection: 'row',
  },
  labelText: {
    flexBasis: 80,
    marginRight: 15,
    color: COLORS.lightGrey1,
    fontSize: 15,
    marginVertical: 2,
    textAlign: 'right',
  },
  valueText: {
    flex: 1,
    color: COLORS.dark1,
    fontSize: 15,
    marginVertical: 2,
  },
  btnSaveReceivers: {
    backgroundColor: '#F3F5F5',
    marginTop: 20,
    width: '100%',
  },
  titleReceivers: {
    color: '#000',
  },
});

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  feeText: {
    textAlign: 'center',
    marginVertical: 3,
    fontSize: 14,
  },
  form: {
    marginTop: 30,
    width: '100%',
  },
  submitBtn: {
    marginTop: 20,
  },
  input: {
    marginBottom: 10,
  },
  memoContainer: {
    marginTop: 10,
  },
  memoText: {
    fontSize: 14,
    color: COLORS.lightGrey3,
  },
  warning: {
    fontSize: 14,
    color: COLORS.lightGrey3,
    textAlign: 'center',
    marginBottom: 15,
  }
});
