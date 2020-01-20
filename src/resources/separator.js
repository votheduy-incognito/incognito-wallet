import { NativeModules, Platform } from 'react-native';
import LocalDatabase from '@utils/LocalDatabase';

let locale;
let decimalSeparator = '.';
let groupSeparator = ',';

function parseSeparatorFromRegion() {
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

    setDecimalSeparator(decimalSeparator);
    console.debug('LOCALE', locale, decimalSeparator, groupSeparator);
  } catch (error) {
    decimalSeparator = '.';
    groupSeparator = ',';
    console.debug('ERROR', error);
  }
}

async function loadSeparator() {
  const savedDecimalSeparator = await LocalDatabase.getDecimalSeparator();

  if (!savedDecimalSeparator) {
    parseSeparatorFromRegion();
  } else {
    decimalSeparator = savedDecimalSeparator;

    if (savedDecimalSeparator === '.') {
      groupSeparator = ',';
    } else {
      groupSeparator = '.';
    }
  }
}

export function setDecimalSeparator(newSeparator) {
  if (decimalSeparator !== newSeparator) {
    groupSeparator = decimalSeparator;
    decimalSeparator = newSeparator;
    LocalDatabase.saveDecimalSeparator(decimalSeparator);
  }
}

export function getDecimalSeparator() {
  return decimalSeparator;
}

export function getGroupSeparator() {
  return groupSeparator;
}

loadSeparator();
