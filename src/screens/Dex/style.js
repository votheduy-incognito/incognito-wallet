import {COLORS, FONT, SPACING} from '@src/styles';
import { StyleSheet } from 'react-native';

export const mainStyle = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightGrey6,
  },
  componentWrapper: {
    flex: 1,
  },
  header: {
    paddingTop: 15,
    paddingBottom: 10,
    height: 'auto',
    backgroundColor: COLORS.dark2,
  },
  headerTitle: {
    fontSize: 20,
    color: COLORS.white,
    ...FONT.STYLE.medium,
    marginVertical: 20,
    marginLeft: 20,
  },
  logo: {
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    color: COLORS.white,
    marginLeft: 'auto',
    marginRight: 'auto',
    ...FONT.STYLE.bold,
    marginVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGrey6,
    position: 'relative',
  },
  modes: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 240,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 6,
  },
  mode: {
    flex: 1,
    paddingVertical: 10,
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: 6,
    overflow: 'hidden',
  },
  modeText: {
    color: COLORS.white,
    fontSize: 16,
    ...FONT.STYLE.medium,
  },
  modeActive: {
    backgroundColor: COLORS.primary,
  },
  scrollView: {
    padding: 15,
  },
  dottedDivider: {
    height: 10,
    marginTop: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey5,
    borderRadius: 1,
  },
  content: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 6,
  },
  arrowWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  arrow: {
    marginHorizontal: 7.5,
    height: 40,
    resizeMode: 'contain',
  },
  divider: {
    flex: 1,
    backgroundColor: COLORS.lightGrey5,
  },
  fee: {
    marginTop: 5,
    fontSize: 14,
  },
  estimateFee: {
    marginBottom: 10,
  },
  feeWrapper: {

  },
  twoColumns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLeft: {
    textAlign: 'left',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    marginLeft: 5,
  },
  disabledButton: {
    backgroundColor: COLORS.lightGrey2,
  },
  mainButton: {
    flex: 1,
    backgroundColor: COLORS.green,
    marginLeft: 15,
    marginRight: 45,
  },
  depositButton: {
    marginRight: 5,
    marginLeft: 0,
    backgroundColor: COLORS.green,
  },
  depositText: {
    marginLeft: 10,
    ...FONT.STYLE.medium,
  },
  withdrawButton: {
    marginLeft: 7.5,
    flex: 1,
  },
  column: {
    flex: 1
  },
  textRight: {
    textAlign: 'right',
    marginLeft: 'auto',
  },
  accountBalance: {
    marginTop: 0,
    maxWidth: 90,
    color: COLORS.dark1,
  },
  accountName: {
    maxWidth: 80,
  },
  longAccountName: {
    maxWidth: 120,
  },
  error: {
    fontSize: 14,
    color: COLORS.red,
  },
  modal: {
    margin: 0,
    padding: 0,
    minWidth: 320,
    borderRadius: 8,
    height: 'auto',
  },
  modalHeader: {
    backgroundColor: COLORS.dark2,
    paddingLeft: 40,
    paddingRight: 25,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderText: {
    fontSize: 18,
    ...FONT.STYLE.medium,
    color: COLORS.white,
    textAlign: 'center',
    marginLeft: 30,
    marginRight: 30,
    flex: 1,
  },
  closeIcon: {
    marginLeft: 'auto',
  },
  modalBack: {
    position: 'absolute',
    left: 30,
  },
  modalContent: {
    maxHeight: 600,
    paddingHorizontal: 25,
  },
  padding: {
    marginTop: 5,
  },
  paddingTop: {
    paddingTop: 25,
  },
  modalEstimate: {
  },
  modalItem: {
    paddingVertical: 15,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey5,
    alignItems: 'center',
    minHeight: 70,
  },
  lastItem: {
    borderBottomWidth: 0,
    marginBottom: 10,
  },
  actionsWrapper: {
    marginTop: 15,
  },
  accountIcon: {
    marginRight: 10,
  },
  viewHistoryText: {
    textAlign: 'center',
    color: COLORS.primary,
    marginTop: 20,
    paddingVertical: 5,
    ...FONT.STYLE.medium,
  },
  hidden: {
    display: 'none',
  },
  hiddenDialog: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
});

export const inputStyle = StyleSheet.create({
  wrapper: {

  },
  header: {
    flexDirection: 'row',
  },
  headerTitle: {
    color: COLORS.lightGrey1,
    fontSize: 16,
  },
  headerBalance: {
    marginLeft: 'auto',
    flexDirection: 'row',
  },
  headerBalanceTitle: {
    fontSize: 14,
  },
  balanceText: {
    fontSize: 14,
    marginLeft: 10,
    color: COLORS.dark1,
  },
  content: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },
  select: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.lightGrey5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: 43,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 26,
    paddingRight: 20,
    maxHeight: 55,
    marginLeft: -3,
    color: COLORS.dark1,
    ...FONT.STYLE.normal
  },
  token: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export const modalStyle = StyleSheet.create({
  dialog: {
    borderRadius: 8,
    height: 'auto',
    paddingTop: 20,
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    paddingRight: 10,
    paddingBottom: 10,
    paddingHorizontal: 25,
  },
  closeButton: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  container: {
    maxHeight: 300,
    paddingHorizontal: 25,
  },
  search: {
    marginHorizontal: 25,
    marginBottom: 15,
    height: 36,
    backgroundColor: COLORS.lightGrey6,
    paddingHorizontal: 20,
  },
  token: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: COLORS.lightGrey5,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  tokenInfo: {
    marginLeft: 10,
  },
  tokenName: {
    color: COLORS.lightGrey1,
    marginTop: 4,
    fontSize: 14,
  },
  tokenSymbol: {
    color: COLORS.dark1,
    fontSize: 14,
  },
});

export const tokenStyle = StyleSheet.create({
  wrapper: {
    marginTop: 10,
  },
  logo: {
    width: 25,
    height: 25,
    marginRight: 2,
  },
  symbol: {
    color: COLORS.dark1,
    marginLeft: 5,
  },
  small: {
    fontSize: 14,
  },
  name: {
    color: COLORS.lightGrey1,
    marginLeft: 5,
  },
  modalName: {
    marginTop: 5,
  },
  input: {
    marginTop: 50,
    ...FONT.STYLE.normal,
    fontSize: 26,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey5,
    paddingVertical: 5,
  },
  error: {
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center',
  },
  button: {
    marginVertical: 15,
    marginBottom: 25,
  },
  loading: {
    marginLeft: 10,
  },
  centerHeader: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  fee: {
    fontSize: 14,
    textAlign: 'center',
  },
  feeWrapper: {
    marginTop: 10,
    marginBottom: 30,
    textAlign: 'center',
    minHeight: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feeContainer: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    marginLeft: 10,
  },
  transferSuccessButton: {
    marginTop: 30,
    width: '100%',
  }
});
