import { COLORS, THEME, FONT } from '@src/styles';
import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  container: {
    marginTop: 30,
    display: 'flex'
  },
  errorBox: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  retryBtn: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    backgroundColor: COLORS.orange,
    marginVertical: 10,
    marginHorizontal: 10,
    maxWidth: 200,
    maxHeight: 40,
    borderRadius: 20,
  },
  errorText: {
    ...THEME.text.errorText,
    textAlign: 'center',
    padding: 15,
    fontSize: 14
  },
  label: {
    marginBottom: 8
  },
  feeTypeGroup: {
    flexDirection: 'row',
  },
  feeType: {
    paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: COLORS.lightGrey6,
    borderBottomWidth: 1,
    borderColor: COLORS.lightGrey4
  },
  feeTypeHighlight: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 0,
  },
  feeTypeFirst: {
    borderRightWidth: 1,
    borderColor: COLORS.lightGrey4
  },
  feeTypeText: {
    color: COLORS.lightGrey3,
  },
  feeTypeTextHighlight: {
    color: COLORS.dark1
  },
  rateContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    minHeight: 60
  },
  box: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: COLORS.lightGrey4,
    backgroundColor: COLORS.white,
    overflow: 'hidden'
  },
  changeFeeForm: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 350,
    padding: 20
  },
  changeFeeInput: {
    flex: 1,
    minWidth: 200,
    marginBottom: 20
  },
  changeFeeSubmitBtn: {
    width: 150,
    borderWidth: 1,
    borderColor: '#0DB8D8',
    borderRadius: 18,
    backgroundColor: COLORS.transparent,
  },
  changeFeeSubmitText: {
    color: COLORS.blue
  },
  feeTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  changeFeeBtn: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginTop: 20,
  },
  changeFeeText: {
    ...FONT.STYLE.medium,
    color: COLORS.blue,
    fontSize: 16,
  },
  feeTextTitle: {
    fontSize: 14,
    color: '#657576',
    marginBottom: 12
  }
});

export default style;
