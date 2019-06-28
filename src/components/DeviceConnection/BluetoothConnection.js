import LocalDatabase from '@src/utils/LocalDatabase';
import Permission from '@src/utils/PermissionUtil';
import Util from '@src/utils/Util';
import { Alert, Platform } from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial';

export const TAG = 'BluetoothConnection';

class BluetoothConnection{

  constructor(props) {
    super(props);
  }
  initBluetooth = ()=>{
    if(Platform.OS === 'android'){
      // const config = {
      //   deviceName: '',
      //   bufferSize: 1024,
      //   characterDelimiter: '\n'
      // };
      // EasyBluetooth.init(config)
      //   .then(function(config) {
      //     console.log(TAG, ' ---- config done!');
      //   })
      //   .catch(function(ex) {
      //     console.warn(ex);
      //   });
    }
  }


  saveItemConnectedInLocal = selectedDevice => {
    const { callbackGettingListPairedDevices } = this.props;
    if (Platform.OS === 'ios') {
      const address = selectedDevice?.url;
      const name = selectedDevice?.name;
      LocalDatabase.savePrinterWifiAddress(address, name);
      callbackGettingListPairedDevices([{ name, address, checked: true }]);
    } else {
      console.log(TAG, 'saveItemConnectedInLocal begin ', selectedDevice);
      // save bluetooth
      let { pairedDevice } = this.state;
      const address = selectedDevice?.address;
      const name = selectedDevice?.name;
      const itemIndex = pairedDevice.findIndex(
        item => item.address === selectedDevice.address
      );
      if (itemIndex > -1) {
        pairedDevice[itemIndex].checked = true;
      } else {
        pairedDevice = [...pairedDevice, { name, address, checked: true }];
      }
      console.log(TAG, 'saveItemConnectedInLocal begin01 ', pairedDevice);

      callbackGettingListPairedDevices(pairedDevice);
    }
  };

  checkBluetoothEnabled = () => {
    return new Promise((resolve, reject) => {
      try {
        if (Platform.OS === 'android') {
          BluetoothSerial.isEnabled().then(
            enabled => {
              console.log(
                TAG,
                `checkBluetoothEnabled ---- begin  enabled =${enabled}`
              );
              if (!enabled) {
                BluetoothSerial.enabled();
              }
              resolve(enabled);
            },
            err => {
              reject(err);
            }
          );
        } else {
          resolve(true);
        }
      } catch (error) {
        reject(error);
      }
    });
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
      // console.log(TAG, 'scan -- enabled  =', devices);
      const [isEnabled, granted] = await Promise.all([
        this.checkBluetoothEnabled(),
        Permission.locationPermission()
      ]);
      if (isEnabled && granted) {
        const devices = await BluetoothSerial.discoverUnpairedDevices(); //EasyBluetooth.startScan();
        console.log(TAG, `scan ${isEnabled} -- enabled01 =`, devices);
        return Promise.resolve(devices);
      }
    } catch (e) {
      console.log(TAG, 'scan error ', e);
      return Promise.reject(e);
    }

    return Promise.resolve([]);
  };

  
}
export default BluetoothConnection;
