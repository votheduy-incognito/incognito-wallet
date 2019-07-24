import {locationPermission } from '@utils/PermissionUtil';
import Util from '@utils/Util';
import { Alert, Platform } from 'react-native';
import Wifi from 'react-native-iot-wifi';
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
    console.log(TAG, 'init begin ------');
    
    return new Promise((resolve, reject) => {
      Wifi.isApiAvailable(available => {
        console.log(TAG, available ? 'available' : 'failed');
        if (available) {
          Wifi.getSSID(SSID => {
            console.log(TAG, 'getSSID', SSID);
            this.currentConnect = new ObjConnection();
            this.currentConnect.id = SSID;
            this.currentConnect.name = SSID;
            resolve(this.currentConnect);
          });
        }
      });
      Util.delay(3).then(() => {
        reject('timeout');
      });
    });
  };

  connectDevice = (device: ObjConnection) => {
    return new Promise((resolve, reject) => {
      const delay = Util.delay(40);
      Wifi.connect(device.name, error => {
        if (!error) {
          Wifi.getSSID(SSID => {
            console.log(TAG, 'getSSID --- ', SSID);
            this.currentConnect = new ObjConnection();
            this.currentConnect.id = SSID;
            this.currentConnect.name = SSID;
            
            resolve(true);
            // Util.makeCancelable(delay)?.cancel();
          });
        } else {
          resolve(false);
        }
      });
      delay.then(() => {
        console.log(TAG, 'connectDevice timeout ');
        reject('timeout');
      });
       
    });

    // Wifi.connectSecure(ssid, passphase, false, (error) => {
    //   this.setState({error: error});
    //   this.setState({connected: error == null});

    //   Wifi.getSSID((SSID) => {
    //     this.setState({ssid: SSID});
    //   });
    // });
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
