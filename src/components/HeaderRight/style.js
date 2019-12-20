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
  descContainer: {
    marginBottom: 40,
  },
  desc: {
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 23,
  },
  iconContainer: {
    height: 70,
    width: 70,
    bottom: -20,
    marginLeft: 20
  },
  updateBtnContainer: {
    paddingVertical: 20,
    marginBottom: 200
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center' ,
    marginBottom: 35,
    backgroundColor: COLORS.blue1,
    top: -1
  },
  headerTextContainer: {
    marginLeft: 20,
    flex: 1
  },
  headerText: {
    fontSize: 18,
    color: COLORS.white
  },
  headerSubText: {
    color: COLORS.white,
    textTransform: 'uppercase',
    fontSize: 14,
    lineHeight: 32
  },
  infoItems: {
    marginBottom: 200
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
