import Wifi from '@josectobar/react-native-iot-wifi';
import { locationPermission } from '@utils/PermissionUtil';
import Util from '@utils/Util';
import _ from 'lodash';
import { Alert, Platform } from 'react-native';
import { PASS_HOSPOT } from 'react-native-dotenv';
import BaseConnection, { ObjConnection } from './BaseConnection';

export const TAG = 'IOTWifiConnection';

class IOTWifiConnection extends BaseConnection {
  constructor() {
    super();

    this.init();
  }
  init = () => {
    this.fetchCurrentConnect();
  };
  
  fetchCurrentConnect =  ():Promise<ObjConnection> => {
    console.log(TAG, 'fetchCurrentConnect begin ------');
    
    const pro =  new Promise((resolve, reject) => {
      Wifi.isApiAvailable(available => {
        console.log(TAG,'fetchCurrentConnect begin 01 = ', available ? 'available' : 'failed');
        if (available) {
          console.log(TAG, 'fetchCurrentConnect begin02 ');
          try {
            Wifi.getSSID(SSID => {
              SSID = _.isEqual('Cannot detect SSID',SSID) || _.isEqual('<unknown ssid>',SSID) ?'':SSID;
              console.log(TAG, 'fetchCurrentConnect getSSID=', SSID);
              this.currentConnect = new ObjConnection();
              this.currentConnect.id = SSID;
              this.currentConnect.name = SSID;
              resolve(this.currentConnect);
            });
          } catch (error) {
            resolve(null);
          }
          
        }else{
          resolve(null);
        }
      });
    });
    return Util.excuteWithTimeout(pro,3);
  };

  removeConnection=async (device: ObjConnection) => {
    return new Promise((resolve, reject) => {
      let SSID = device?.name||'';
      console.log(TAG, 'removeConnection begin result = ',device?.name||'');
      Wifi.removeSSID(SSID,false,error => {
        resolve(!error);
      });
      
      resolve(true);
    });
    
  } 

  connectDevice = (device: ObjConnection) => {
   
    const pro = new Promise((resolve,reject)=>{
      Wifi.connectSecure(device.name,PASS_HOSPOT,false,true, error => {
        console.log(TAG, 'connectDevice begin --- error = ',error);
        
        if (!error || _.isEqual('already associated.',error)) {
          
          Util.delay(3).then(this.fetchCurrentConnect).then(objConnection=>{
            // dont get objConnection with IOS 13 #bug
            let SSID = device.name ??'';
            this.currentConnect = new ObjConnection();
            this.currentConnect.id = SSID;
            this.currentConnect.name = SSID;
            console.log(TAG, 'connectDevice begin 01 getSSID --- ', SSID);
            resolve(true);
          });
        } else {
          console.log(TAG, 'connectDevice --- error = ',error);
          reject(new Error(error));
        }
          
      });
    }); 
      
    return Util.excuteWithTimeout(pro,15).catch(e=>console.log('connectDevice --- failed end'));

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
export default IOTWifiConnection;