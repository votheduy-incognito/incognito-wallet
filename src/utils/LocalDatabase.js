import { AsyncStorage } from 'react-native';
import _ from 'lodash';
import User from '@src/models/User';

const TAG = 'LocalDatabase';
const KEY_SAVE = {
  USER: 'USER'
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
  static async logout() {
    return await AsyncStorage.multiRemove([KEY_SAVE.USER]);
  }
  static async saveUserInfo(jsonUser: String) {
    const oldUser = await this.getValue(KEY_SAVE.USER);
    if (jsonUser !== oldUser) {
      const data = { ...JSON.parse(oldUser), ...JSON.parse(jsonUser) };
      await this.saveValue(KEY_SAVE.USER, JSON.stringify(data));
    }
  }
  static async getUserInfo(): User {
    const userJson = (await this.getValue(KEY_SAVE.USER)) || '';
    return _.isEmpty(userJson) ? null : new User(JSON.parse(userJson));
  }
}
