import User from '@models/user';
import AsyncStorage from '@react-native-community/async-storage';
import { CONSTANT_KEYS } from '@src/constants';
import _ from 'lodash';

const TAG = 'LocalDatabase';
export const KEY_SAVE = {
  USER: CONSTANT_KEYS.USER,
  LIST_DEVICE:CONSTANT_KEYS.LIST_DEVICE,
  DEX: CONSTANT_KEYS.DEX,
  DEX_HISTORY: CONSTANT_KEYS.DEX_HISTORY,
  SEEN_DEPOSIT_GUIDE: CONSTANT_KEYS.SEEN_DEPOSIT_GUIDE,
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

  static removeDevice = async (device)=>{
    let list = await LocalDatabase.getListDevices();
    _.remove(list,item=>{
      return item.product_id == device.product_id;
    });
    await LocalDatabase.saveListDevices(list);
  }
  static updateDevice = async (deviceJson)=>{
    let list = await LocalDatabase.getListDevices();
    const index = _.findIndex(list,['product_id',deviceJson.product_id]);
    if(index >=0){
      list[index] = {
        ...list[index],
        ...deviceJson
      };
    }else{
      list.push(deviceJson);
    }
    await LocalDatabase.saveListDevices(list);
  }
  /**
   * return {JSON} : deviceInfo
   */
  static getDevice = async (product_id)=>{
    if(_.isEmpty(product_id)) throw new Error('product_id is empty');

    let list = await LocalDatabase.getListDevices();
    const index = _.findIndex(list,['product_id',product_id]);
    return list[index];
  }
  static saveListDevices = async (jsonListDevice: []) => {
    const listDevices = JSON.stringify(jsonListDevice);
    // console.log(TAG, ' saveListDevices begin ', listDevices);
    await LocalDatabase.saveValue(KEY_SAVE.LIST_DEVICE, listDevices);
  };
  static saveDeviceKeyInfo = async (product_id,keyInfo) => {
    if(!_.isEmpty(product_id) && !_.isEmpty(keyInfo)){
      const deviceJSON = await LocalDatabase.getDevice(product_id).catch(e=>throw new Error('device not found in local'))??undefined;
      if(deviceJSON){
        deviceJSON['keyInfo'] = {
          ...deviceJSON['keyInfo'],
          ...keyInfo
        };
        await LocalDatabase.updateDevice(deviceJSON);
        console.log(TAG, ' saveDeviceKeyInfo end success deviceJSON=',deviceJSON);
      }
    }
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
  static async getUserInfo(): Promise<User> {
    const userJson = (await LocalDatabase.getValue(KEY_SAVE.USER)) || '';
    return _.isEmpty(userJson) ? null : new User(JSON.parse(userJson));
  }

  static async saveDEXInfo(dexInfo) {
    await LocalDatabase.saveValue(KEY_SAVE.DEX, JSON.stringify(dexInfo));
  }

  static async getDEXInfo() {
    const dexString = (await LocalDatabase.getValue(KEY_SAVE.DEX)) || '';
    return _.isEmpty(dexString) ? null : JSON.parse(dexString);
  }

  static async saveDexHistory(swapHistory) {
    await LocalDatabase.saveValue(KEY_SAVE.DEX_HISTORY, JSON.stringify(swapHistory));
  }

  static async getDexHistory() {
    const swapHistory = (await LocalDatabase.getValue(KEY_SAVE.DEX_HISTORY)) || '';
    return _.isEmpty(swapHistory) ? [] : JSON.parse(swapHistory);
  }

  static async saveSeenDepositGuide(firstTime) {
    await LocalDatabase.saveValue(KEY_SAVE.SEEN_DEPOSIT_GUIDE, JSON.stringify(firstTime));
  }

  static async getSeenDepositGuide() {
    const seenDepositGuide = (await LocalDatabase.getValue(KEY_SAVE.SEEN_DEPOSIT_GUIDE)) || '';
    return _.isEmpty(seenDepositGuide) ? false : JSON.parse(seenDepositGuide);
  }
}
