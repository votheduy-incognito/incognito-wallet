import User from '@models/user';
import AsyncStorage from '@react-native-community/async-storage';
import _ from 'lodash';

const TAG = 'LocalDatabase';
const KEY_SAVE = {
  USER: 'USER_OBJECT_KEY',
  LIST_DEVICE:'PRODUCT_LIST_KEY'
};
export default class LocalDatabase {
  static async getValue(key: String): String {
    // console.log(TAG, ' getValue begin ', key);
    const s = await AsyncStorage.getItem(key);
    return s;
  }
  static saveValue = async (key: String, value: Object) => {
    // console.log(TAG, ' saveValue begin ', value);
    await AsyncStorage.setItem(key, value);
  };

  static getListDevices = async (): [] => {
    let listDevice = '';
    try {
      listDevice = (await LocalDatabase.getValue(KEY_SAVE.LIST_DEVICE)) || '';
    } catch (error) {
      console.log(TAG, ' getListDevices error ');
    }
    return Promise.resolve(
      !_.isEmpty(listDevice) ? JSON.parse(listDevice) : []
    );
  };
  static saveListDevices = async (jsonListDevice: []) => {
    const listDevices = JSON.stringify(jsonListDevice);
    // console.log(TAG, ' saveListDevices begin ', listDevices);
    await LocalDatabase.saveValue(KEY_SAVE.LIST_DEVICE, listDevices);
  };
  static async logout() {
    return await AsyncStorage.multiRemove([
      KEY_SAVE.USER,
      KEY_SAVE.LIST_DEVICE
    ]);
  }
  static async saveUserInfo(jsonUser: String) {
    const oldUser = await LocalDatabase.getValue(KEY_SAVE.USER);
    if (jsonUser !== oldUser) {
      const data = { ...JSON.parse(oldUser), ...JSON.parse(jsonUser) };
      await LocalDatabase.saveValue(KEY_SAVE.USER, JSON.stringify(data));
    }
  }
  static async getUserInfo(): User {
    const userJson = (await LocalDatabase.getValue(KEY_SAVE.USER)) || '';
    return _.isEmpty(userJson) ? null : new User(JSON.parse(userJson));
  }
}
