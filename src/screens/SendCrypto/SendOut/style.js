import { StyleSheet } from 'react-native';
import { COLORS, FONT } from '@src/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12,
  },
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
    marginVertical: 50
  },
  memoContainer: {
  },
  memoText: {
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 4,
    color: COLORS.colorGreyBold,
  },
  warning: {
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 4,
    color: COLORS.colorGreyBold,
    textAlign: 'center',
    marginBottom: 15,
  },
  estimateFee: {
    marginTop: 10
  }
});
