import { AsyncStorage } from 'react-native';
import { ExHandler } from '@services/exception';

export const FAKE_FULL_DISK_KEY = '$make-full-disk|';

const makeFullDiskBig = async () => {
  try {
    for (let i = 0; i < 15; i++) {
      const key = FAKE_FULL_DISK_KEY + Date.now();
      let str = await AsyncStorage.getItem(key) || Date.now().toString();
      const maxLoop = 15;
      let index = 0;
      while (index < maxLoop) {
        str += str;
        index++;
      }
      await AsyncStorage.setItem(key, str);
    }
  } catch (e) {
    new ExHandler(e).showErrorToast();
  }
};

const makeFullDiskNormal = async () => {
  try {
    for (let i = 0; i < 30; i++) {
      const key = FAKE_FULL_DISK_KEY + Date.now();
      let str = await AsyncStorage.getItem(key) || Date.now().toString();
      const maxLoop = 10;
      let index = 0;
      while (index < maxLoop) {
        str += str;
        index++;
      }
      await AsyncStorage.setItem(key, str);
    }
  } catch (e) {
    new ExHandler(e).showErrorToast();
  }
};

const makeFullDiskSmall = async () => {
  try {
    const key = FAKE_FULL_DISK_KEY + Date.now();
    let str = await AsyncStorage.getItem(key) || '1';
    while (true) {
      str += '1';
      await AsyncStorage.setItem(key, str);
    }
  } catch (e) {
    new ExHandler(e).showErrorToast();
  }
};

export const makeFakeFullDisk = async () => {
  try {
    await makeFullDiskBig();
    await makeFullDiskNormal();
    await makeFullDiskSmall();
  } catch (e) {/*Ignored*/}
};

export const clearFakeFullDisk = async() => {
  const keys = await AsyncStorage.getAllKeys();
  for (const key of keys) {
    if (key.includes(FAKE_FULL_DISK_KEY)) {
      AsyncStorage.removeItem(key);
    }
  }
};