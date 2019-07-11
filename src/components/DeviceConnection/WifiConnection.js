import { locationPermission } from '@src/utils/PermissionUtil';
import Util from '@src/utils/Util';
import { Alert } from 'react-native';
import Wifi from 'react-native-iot-wifi';
import BaseConnection, { ObjConnection } from './BaseConnection';

export const TAG = 'WifiConnection';

class WifiConnection extends BaseConnection{

  constructor() {
    super();
    this.init();
  }
  init = async ()=>{
    const available =  await new Promise((resolve,reject)=>{
      Wifi.isApiAvailable((available) => {
        console.log(TAG,available ? 'available' : 'failed');
        resolve(available);
      });
      Util.delay(3).then(
        ()=>{reject('timeout');}
      );
    });
    if(available){
      Wifi.getSSID((SSID) => {
        console.log(TAG,'getSSID' ,SSID);
      });
    }
  }
  
  connectDevice = async (device:ObjConnection) => {
  
  };
  
  
  destroy = ()=>{
    
  }

  disconnectDevice = () => {
    
  };
  stopScan = async () => {
    
  };

  onGetAvailableDevices = () => {
    
  };
  onGetConnectionInfo = () => {
    
  };

  checkRegular = async ():Promise<Boolean>=> {
    try {
      const [isEnabled, granted] = await Promise.all([
        locationPermission()
      ]);
      return Promise.resolve(isEnabled && granted);
    } catch (error) {
      return Promise.reject(error);
    }

  };

  alertBluetooth = () => {
    Alert.alert(
      'Turn on bluetooth',
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
