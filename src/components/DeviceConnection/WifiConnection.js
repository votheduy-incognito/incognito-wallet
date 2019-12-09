import { locationPermission } from '@utils/PermissionUtil';
import Util from '@utils/Util';
import _ from 'lodash';
import { Alert, Platform } from 'react-native';
import { PASS_HOSPOT } from 'react-native-dotenv';
// import Wifi from 'react-native-iot-wifi';
import WifiManager from 'react-native-wifi-reborn';
import { NetworkInfo } from 'react-native-network-info';
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
  
  fetchCurrentConnect =  ():Promise<ObjConnection> => {
    console.log(TAG, 'fetchCurrentConnect begin ------');
    let pro = async()=>{
      try {
        let SSID = await WifiManager.getCurrentWifiSSID();
        
        SSID = _.isEqual('Cannot detect SSID',SSID) || _.isEqual('<unknown ssid>',SSID) ?'':SSID;
        console.log(TAG, 'fetchCurrentConnect getSSID=', SSID);
        if(!_.isEmpty(SSID)){
          this.currentConnect = new ObjConnection();
          this.currentConnect.id = SSID;
          this.currentConnect.name = SSID;        
          console.log('Your current connected wifi SSID is ' + SSID);
          return this.currentConnect;
        }
      } catch (error) {
        console.log('Cannot get current SSID!', error);
      }
      return null;
    };

    // const pro =  new Promise((resolve, reject) => {
    //   Wifi.isApiAvailable(available => {
    //     console.log(TAG,'fetchCurrentConnect begin 01 = ', available ? 'available' : 'failed');
    //     if (available) {
    //       console.log(TAG, 'fetchCurrentConnect begin02 ');
    //       try {
    //         // hien.ton test
    //         // NetworkInfo.getIPAddress().then(ipAddress => {
    //         //   console.log(TAG, 'fetchCurrentConnect new - getIPAddress ',ipAddress);
    //         // });
    //         // NetworkInfo.getGatewayIPAddress().then(defaultGateway => {

    //         //   console.log(TAG, 'fetchCurrentConnect new ---- defaultGateway=', defaultGateway);
    //         // });
    //         // NetworkInfo.getSSID().then(ssid => {
    //         //   console.log(TAG, 'fetchCurrentConnect new ---- getSSID=', ssid);
    //         // });
    //         /////////
    //         Wifi.getSSID(SSID => {
    //           SSID = _.isEqual('Cannot detect SSID',SSID) || _.isEqual('<unknown ssid>',SSID) ?'':SSID;
    //           console.log(TAG, 'fetchCurrentConnect getSSID=', SSID);
    //           this.currentConnect = new ObjConnection();
    //           this.currentConnect.id = SSID;
    //           this.currentConnect.name = SSID;
    //           resolve(this.currentConnect);
    //         });
    //       } catch (error) {
    //         resolve(null);
    //       }
          
    //     }else{
    //       resolve(null);
    //     }
    //   });
    // });
    return Util.excuteWithTimeout(pro(),3);
  };

  removeConnection=async (device: ObjConnection) => {
    // return new Promise((resolve, reject) => {
    //   let SSID = device?.name||'';
    //   console.log(TAG, 'removeConnection begin result = ',device?.name||'');
    //   Wifi.removeSSID(SSID,false,error => {
    //     resolve(!error);
    //   });
      
    //   resolve(true);
    // });

    try {
      let SSID = device?.name||'';
      const result = !_.isEmpty(SSID) && await WifiManager.disconnectFromSSID(SSID);
      return true;
    } catch (error) {
      console.log(TAG,'removeConnection error = ',error);
    }
    return false;
  } 

  connectDevice = (device: ObjConnection) => {
   
    const pro = async() => {
      try {
        let SSID = device.name;
        console.log(TAG, 'connectDevice begin000 --- name = ',SSID);
        const data = await WifiManager.connectToProtectedSSID(SSID,PASS_HOSPOT,false);
        console.log(TAG, 'connectDevice begin111 --- data = ',data);
        await Util.delay(4);
        
        this.currentConnect = new ObjConnection();
        this.currentConnect.id = SSID;
        this.currentConnect.name = SSID;
        return true;
      } catch (error) {
        throw new Error(error);
      }
    };

    // const pro = new Promise((resolve,reject)=>{
    //   Wifi.connectSecure(device.name,PASS_HOSPOT,false,true, error => {
    //     console.log(TAG, 'connectDevice begin --- error = ',error);
        
    //     if (!error || _.isEqual('already associated.',error)) {
          
    //       Util.delay(3).then(this.fetchCurrentConnect).then(objConnection=>{
    //         // dont get objConnection with IOS 13 #bug
    //         let SSID = device.name ??'';
    //         this.currentConnect = new ObjConnection();
    //         this.currentConnect.id = SSID;
    //         this.currentConnect.name = SSID;
    //         console.log(TAG, 'connectDevice begin 01 getSSID --- ', SSID);
    //         resolve(true);
    //       });
    //       // Wifi.getSSID(SSID => {
    //       //   console.log(TAG, 'connectDevice begin 01 getSSID --- ', SSID);
                
    //       //   this.currentConnect = new ObjConnection();
    //       //   this.currentConnect.id = SSID;
    //       //   this.currentConnect.name = SSID;
    //       //   resolve(_.isEqual(device.name,SSID));
    //       // });
    //     } else {
    //       console.log(TAG, 'connectDevice --- error ngon = ',error);
    //       reject(new Error(error));
         
    //     }
        
          
    //   });
    // }); 
      
    return Util.excuteWithTimeout(pro(),15);
  
  };

  isConnectedWithNodeHotspot = async ()=>{
    const defaultGateway = await NetworkInfo.getGatewayIPAddress();
    console.log(TAG, 'isConnectedWithNodeHotspot new ---- defaultGateway=', defaultGateway);
    return _.includes(defaultGateway,'10.42.');
  }

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
