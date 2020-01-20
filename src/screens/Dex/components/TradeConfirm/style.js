import {COLORS, FONT, SPACING} from '@src/styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  dialog: {
    backgroundColor: COLORS.lightGrey10,
    borderRadius: 10,
    height: 'auto',
    paddingVertical: 15,
    width: 360,
  },
  dialogContent: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  dialogTitle: {
    fontSize: 20,
    ...FONT.STYLE.medium,
  },
  closeIcon: {
    padding: 15,
    marginRight: -15,
    marginLeft: 'auto',
  },
  middle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandContent: {
    marginTop: 10,
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    borderColor: COLORS.lightGrey11,
    borderWidth: 1,
  },
  expandIcon: {
    marginHorizontal: 10,
    marginRight: 5,
    resizeMode: 'contain',
  },
  expandIconActive: {
    transform: [{ rotate: '90deg'}]
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    marginTop: 20,
    marginBottom: 5,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey5,
    flex: 1,
    fontSize: 16,
    paddingRight: 35,
    color: COLORS.dark1,
    ...FONT.STYLE.normal,
  },
  fullInput: {
    paddingRight: 5
  },
  percentInput: {
    paddingRight: 20,
  },
  percentWrapper: {
    width: 75,
  },
  percent: {
    position: 'absolute',
    right: 5,
    bottom: 11,
  },
  feeWrapper: {
    marginBottom: 25,
  },
  feeUnit: {
    position: 'absolute',
    bottom: 11,
    right: 5,
    fontSize: 14,
    color: COLORS.lightGrey9,
  },
  feeType: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: COLORS.lightGrey5,
    borderRadius: 4,
    paddingVertical: 5,
  },
  feeTypeText: {
    color: COLORS.lightGrey1,
  },
  feeActive: {
    backgroundColor: COLORS.dark1,
  },
  feeActiveText: {
    color: COLORS.white,
  },
  fee: {
    fontSize: 15,
    maxWidth: 120,
  },
  feeTitle: {
    color: COLORS.lightGrey9,
    fontSize: 15,
    width: 100,
  },
  compare: {
    marginHorizontal: 5,
    marginTop: 15,
  },
  error: {
    lineHeight: 20,
    fontSize: 14,
  },
  errorHighlight: {
    borderBottomColor: COLORS.red,
  },
  chainError: {
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  tradeInfo: {
    marginTop: 10,
    marginBottom: 30,
    marginHorizontal: -25,
    marginRight: -24,
    backgroundColor: COLORS.lightGrey13,
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  tradeField: {
    marginVertical: 10,
  },
  tradeValue: {
    ...FONT.STYLE.bold,
    maxWidth: 120,
  },
  smallSymbol: {
    marginTop: 2,
    fontSize: 12,
  },
  grey: {
    color: COLORS.lightGrey9,
    marginBottom: 2,
    fontSize: 14,
  },
  balanceValue: {
    fontSize: 14,
    maxWidth: 110,
  },
  balanceSymbol: {
    paddingLeft: 5,
    fontSize: 14,
  },
  tradeArrow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flex: 1,
    alignItems: 'center',
  }
});
