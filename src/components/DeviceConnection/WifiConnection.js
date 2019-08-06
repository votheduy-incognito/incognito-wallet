import {locationPermission } from '@utils/PermissionUtil';
import Util from '@utils/Util';
import { Alert, Platform } from 'react-native';
import Wifi from 'react-native-iot-wifi';
import {PASS_HOSPOT} from 'react-native-dotenv';
import _ from 'lodash';
import BaseConnection, { ObjConnection } from './BaseConnection';

export const TAG = 'WifiConnection';

class WifiConnection extends BaseConnection {
  constructor() {
    super();

    this.init();
  }
  init = () => {
    this.fetchCurrentConnect();
  };
  
  fetchCurrentConnect =  () => {
    console.log(TAG, 'fetchCurrentConnect begin ------');
    const pro =  new Promise((resolve, reject) => {
      Wifi.isApiAvailable(available => {
        console.log(TAG, available ? 'available' : 'failed');
        if (available) {
          Wifi.getSSID(SSID => {
            console.log(TAG, 'fetchCurrentConnect getSSID', SSID);
            this.currentConnect = new ObjConnection();
            this.currentConnect.id = SSID;
            this.currentConnect.name = SSID;
            resolve(this.currentConnect);
          });
        }else{
          resolve(null);
        }
      });
    });
    return Util.excuteWithTimeout(pro,3);
  };

  connectDevice = (device: ObjConnection) => {
    const pro = new Promise((resolve, reject) => {
      Wifi.connectSecure(device.name,PASS_HOSPOT,false, error => {
        if (!error) {
          Wifi.getSSID(SSID => {
            console.log(TAG, 'connectDevice getSSID --- ', SSID);
            this.currentConnect = new ObjConnection();
            this.currentConnect.id = SSID;
            this.currentConnect.name = SSID;
            resolve(_.isEqual(device.name,SSID));
          });
        } else {
          resolve(false);
        }
      });
      
    });
    // return Util.excuteWithTimeout(pro,5);
    return pro;

  };

  destroy = () => {};

  disconnectDevice = () => {};
  stopScan = async () => {};

  onGetAvailableDevices = () => {};
  onGetConnectionInfo = () => {};

  checkRegular = async (): Promise<Boolean> => {
    if (Platform.OS === 'ios') {
      return Promise.resolve(true);
    }
    try {
      const [isEnabled, granted] = await Promise.all([locationPermission()
      ]);
      return Promise.resolve(isEnabled && granted);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  alertBluetooth = () => {
    Alert.alert(
      'Turn on Wifi',
      '',
      [
        {
          text: 'Ask me later',
          onPress: () => console.log('Ask me later pressed')
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            Util.openSetting('Bluetooth');
          }
        }
      ],
      { cancelable: false }
    );
  };

  getDeviceSavedList = async () => {
    // const { callbackGettingListPairedDevices } = this.props;
    return [];
  };

  scan = async () => {
    try {
      console.log(TAG, 'scan -- begin');
      const isRegular = await this.checkRegular();
      
    } catch (e) {
      console.log(TAG, 'scan error ', e);
      return Promise.reject(e);
    }
    return Promise.resolve([]);
  };
}
export default WifiConnection;
