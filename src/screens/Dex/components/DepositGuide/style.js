import {COLORS} from '@src/styles';
import {Platform, StyleSheet} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const isIOS = Platform.OS === 'ios';
const isIphoneX = DeviceInfo.hasNotch();

let marginTop = 80;

if (isIOS) {
  marginTop = isIphoneX ? 120 : 80;
}

export default StyleSheet.create({
  guide: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  content: {
    marginTop: marginTop,
    marginHorizontal: 30,
    borderRadius: 20,
  },
  textContent: {
    backgroundColor: COLORS.lightGrey10,
    padding: 25,
    borderRadius: 15,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 0,
    borderRightWidth: 14,
    borderBottomWidth: 20,
    borderLeftWidth: 14,
    marginLeft: 30,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.lightGrey10,
    borderLeftColor: 'transparent',
  },
  text: {
    fontSize: 18,
    lineHeight: 28,
  },
  text2: {
    marginTop: 25,
  },
});
