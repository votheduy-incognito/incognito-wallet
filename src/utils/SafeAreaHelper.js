import DeviceInfo from 'react-native-device-info';

export const getBottomAreaHeight = () => {
  const hasNotch = DeviceInfo.hasNotch();
  return hasNotch ? 34 : 0;
};