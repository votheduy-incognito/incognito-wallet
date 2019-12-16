import { StyleSheet } from 'react-native';
import {COLORS, FONT} from '@src/styles';

export const sendReceiveGroupStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  btn: {
    marginLeft: 20.0,
    width: 20,
    height: 20,
  },
  image: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  }
});

export const tokenInfoStyle = StyleSheet.create({
  container: {

  },
  updateBtn: {
    backgroundColor: COLORS.transparent,
    borderColor: COLORS.primary,
    height: 30
  },
  updateBtnText: {
    color: COLORS.primary,
    ...FONT.STYLE.medium
  },
  icon: {
    marginHorizontal: 10
  },
  modalContainer: {
    backgroundColor: COLORS.white
  },
  infoContainer: {
    padding: 35,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center' ,
    marginBottom: 35,
  },
  headerTextContainer: {
    marginLeft: 20,
    flex: 1
  },
  headerText: {
    fontSize: 24,
    color: COLORS.dark1
  },
  headerSubText: {
    color: COLORS.lightGrey1,
  },
  infoItems: {

  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  infoItemLabel: {
    width: 150,
    color: COLORS.lightGrey1,
  },
  infoItemValue: {
    flex: 1,
    paddingHorizontal: 4
  },
  row: {
    flexDirection: 'row',
  },
  copyText: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: COLORS.transparent,
    borderWidth: 1,
    borderColor: COLORS.lightGrey1,
    textAlign: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    fontSize: 14,
    ...FONT.STYLE.medium,
  },
  rightBlock: {
    flexBasis: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  copied: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 50,
    padding: 10,
    backgroundColor: COLORS.toastBackgroundDefault,
    borderRadius: 4,
  },
  copiedMessage: {
    color: COLORS.white,
    fontSize: 14,
  },
});
