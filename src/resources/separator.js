import { NativeModules, Platform } from 'react-native';

let locale;
let decimalSeparator = '.';
let groupSeparator = ',';

try {
  if (Platform.OS === 'ios') {
    const keyboard = (NativeModules.SettingsManager.settings.AppleKeyboards ||
      NativeModules.SettingsManager.settings.ApplePasscodeKeyboards)[0];
    locale = keyboard.slice(0, keyboard.indexOf('_'));
  } else {
    locale = NativeModules.I18nManager.localeIdentifier;
    locale = locale.slice(0, locale.indexOf('_'));
  }

  if (1.1.toLocaleString(locale).indexOf(',') > -1) {
    decimalSeparator = ',';
    groupSeparator = '.';
  } else {
    decimalSeparator = '.';
    groupSeparator = ',';
  }
} catch (error) {
  console.debug('ERROR', error);
}

export const DECIMAL_SEPARATOR = decimalSeparator;
export const GROUP_SEPARATOR = groupSeparator;
