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
  infoItemValueContainer: {
    flexDirection: 'row',
    flex: 1
  },
  infoItemValue: {
    flex: 1
  },
  link: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderStyle: 'dashed',
    borderColor: COLORS.green,
    alignSelf: 'flex-start'
  },
  linkText: {
    color: COLORS.green
  },
  descContainer: {
    marginBottom: 40,
  },
  verifyText: {
    color: COLORS.green,
    ...FONT.STYLE.medium
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
  icon: {
    marginHorizontal: 10
  },
  modalContainer: {
    backgroundColor: COLORS.white
  },
  infoContainer: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1
  },
  updateBtnContainer: {
    marginTop: 30,
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
  infoItemValueCopy: {
    flexBasis: 60,
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
