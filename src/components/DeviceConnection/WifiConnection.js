import NetInfo from '@react-native-community/netinfo';
import APIService from '@src/services/api/miner/APIService';
import { CustomError, ExHandler } from '@src/services/exception';
import knownCode from '@src/services/exception/customError/code/knownCode';
import { locationPermission } from '@utils/PermissionUtil';
import Util from '@utils/Util';
import _ from 'lodash';
import { Platform } from 'react-native';
import { PASS_HOSPOT } from 'react-native-dotenv';
import Wifi from 'react-native-iot-wifi';
import WifiManager from 'react-native-wifi-reborn';
import DeviceLog from '../DeviceLog';
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
  
  /**
   * throw ex with 3s timeout
   * return {null ||ObjConnection}
   */
  fetchCurrentConnect =  ():Promise<ObjConnection> => {
    console.log(TAG, 'fetchCurrentConnect begin ------');
    let pro = async()=>{
      try {
        const state = await NetInfo.fetch().catch(console.log);
        const {isConnected = false, isInternetReachable = false,details =null} = state ??{};
        const { ipAddress = '',isConnectionExpensive = false,ssid='' } = details ??{};
        SSID =  await WifiManager.getCurrentWifiSSID();
        let SSID = _.isEmpty(SSID) ? ssid:SSID;
        
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
    return Util.excuteWithTimeout(pro(),3);
  };

  removeConnection=async (device: ObjConnection) => {
    try {
      let SSID = device?.name||'';
      let result = false;
      if(Platform.OS == 'android'){
        const removeWifiFunc =  new Promise((resolve, reject) => {
          console.log(TAG, 'removeConnection begin result = ',device?.name||'');
          Wifi.removeSSID(SSID,false,error => {
            resolve(!error);
          });
          resolve(true);
        });
        result =  !_.isEmpty(SSID) && await removeWifiFunc();
      }else{
        result =  !_.isEmpty(SSID) && await WifiManager.disconnectFromSSID(SSID);
      }
      return result;
    } catch (error) {
      console.log(TAG,'removeConnection error = ',error);
    }
    return false;
  } 

  /**
   * 
   */
  connectDevice = (wifiObj: ObjConnection) => {
    
    const pro = async() => {
      const funcName = 'connectDevice';
      let SSID = wifiObj?.name??'';
      const password = wifiObj?.password || PASS_HOSPOT;
      try {
        
        const logHandler = new ExHandler(new CustomError(knownCode.node_can_not_connect_hotspot));
        console.log(TAG, 'connectDevice begin000 --- name = ',SSID);
        
        DeviceLog.logInfo(`${TAG} connectDevice ssid=${SSID}-pass=${password}`);
        let data = await WifiManager.connectToProtectedSSID(SSID,password,false).catch(e=>{
          console.log(TAG, 'connectToProtectedSSID begin --- error ,',e);
          APIService.trackLog({action:funcName, message:`connectToProtectedSSID error catch ${SSID} -pass=${password}`,rawData:`errorMessage=${e.message??''}`});
          logHandler.throw();
        });
        console.log(TAG, 'connectDevice begin111 --- data = ',data);
        await Util.delay(3);
        if(_.isEmpty(data)){
          await Util.delay(3);
          data = await this.fetchCurrentConnect();
          console.log(TAG, 'connectDevice begin222--- data = ',data);
          DeviceLog.logInfo(`${TAG} connectDevice data.name=${data?.name||''}`);
          if(_.isEmpty(data)){
            // IOS 13.2
            // await Util.delay(3);
            // data = await this.isConnectedWithNodeHotspot();
            // data ? null:logHandler.throw();
          }else{
            
            !_.isEqual(data.name,SSID) ? logHandler.throw():null;
          }
        }
        
        this.currentConnect = new ObjConnection();
        this.currentConnect.id = SSID;
        this.currentConnect.name = SSID;
        return true;
      } catch (error) {
        await APIService.trackLog({action:funcName, message:`error catch ${SSID} -pass=${password}`});
        error instanceof CustomError && new ExHandler(error).throw();
      }
    };
    return Util.excuteWithTimeout(pro(),15);
  };

  // isConnectedWithNodeHotspot = async ()=>{
  //   try {
  //     const prefixHotspotIP = '10.42.';
  //     const defaultGateway = await NetworkInfo.getGatewayIPAddress().catch(console.log)??'';
  //     const isValidateIpAdrress = _.includes(defaultGateway,prefixHotspotIP);
  //     console.log(TAG, 'isConnectedWithNodeHotspot new ---- defaultGateway=', defaultGateway);
  //     const state = await NetInfo.fetch().catch(console.log);
  //     const {isConnected = false, isInternetReachable = false,details =null} = state ??{};
  //     const { ipAddress = '',isConnectionExpensive = false,ssid='' } = details ??{};
  //     return isValidateIpAdrress || (isConnected && !isInternetReachable) || (isConnected && _.includes(ipAddress,prefixHotspotIP) );
  //   } catch (error) {
  //     return null;
  //   }
    
  // }

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
