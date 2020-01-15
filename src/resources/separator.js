import { NativeModules, Platform } from 'react-native';

let locale;
let decimalSeparator = '.';
let groupSeparator = ',';

try {
  if (Platform.OS === 'ios') {
    const settings = NativeModules.SettingsManager.settings || {};
    const keyboard = settings.AppleLocale ||
      (settings.AppleKeyboards || settings.ApplePasscodeKeyboards)[0];
    if (keyboard.length <= 6) {
      locale = keyboard.split('_')[1];
    } else {
      locale = keyboard.slice(0, keyboard.indexOf('_'));
    }
  } else {
    locale = NativeModules.I18nManager.localeIdentifier;
    locale = locale.split('_')[1];
  }

  if (1.1.toLocaleString(locale).indexOf(',') > -1) {
    decimalSeparator = ',';
    groupSeparator = '.';
  } else {
    decimalSeparator = '.';
    groupSeparator = ',';
  }

  console.debug('LOCALE', locale, decimalSeparator, groupSeparator);
} catch (error) {
  console.debug('ERROR', error);
}

export const DECIMAL_SEPARATOR = decimalSeparator;
export const GROUP_SEPARATOR = groupSeparator;
