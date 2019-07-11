// import AsyncStorage from '@react-native-community/async-storage';
import User from '@src/models/user';
import _ from 'lodash';
import { AsyncStorage } from 'react-native';

const TAG = 'LocalDatabase';
const KEY_SAVE = {
  USER: 'USER',
  LIST_DEVICE: 'LIST_DEVICE',
};
export default class LocalDatabase {
  static async getValue(key: String): String {
    // console.log(TAG, ' getValue begin ', key);
    const s = await AsyncStorage.getItem(key);
    return s;
  }
  static async saveValue(key: String, value: Object): {} {
    await AsyncStorage.setItem(key, value);
  }

  static getListDevices = async ():[] =>{
    const listDevice = (await LocalDatabase.getValue(KEY_SAVE.LIST_DEVICE)) || '';
    return _.isEmpty(listDevice) ? JSON.parse(listDevice):[]; 
  }
  static async logout() {
    return await AsyncStorage.multiRemove([KEY_SAVE.USER]);
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
