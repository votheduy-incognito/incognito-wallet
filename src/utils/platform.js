import { Platform } from 'react-native';

export function isIOS() {
  return Platform.OS === 'ios';
}

export function isAndroid() {
  Platform.OS === 'android';
}
