import Wifi from '@josectobar/react-native-iot-wifi';
import NetInfo from '@react-native-community/netinfo';
import APIService from '@src/services/api/miner/APIService';
import { CustomError, ExHandler } from '@src/services/exception';
import knownCode from '@src/services/exception/customError/code/knownCode';
import { locationPermission } from '@utils/PermissionUtil';
import Util from '@utils/Util';
import _ from 'lodash';
import { Platform } from 'react-native';
import { PASS_HOSPOT } from 'react-native-dotenv';
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
        let SSID =  await WifiManager.getCurrentWifiSSID();
        if(_.isEmpty(SSID)){
          const state = await NetInfo.fetch().catch(console.log);
          const {isConnected = false, isInternetReachable = false,details =null} = state ??{};
          const { ipAddress = '',isConnectionExpensive = false,ssid='' } = details ??{};
          SSID =  ssid;
        }
        
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
    return Util.excuteWithTimeout(pro(),4);
  };

  fetchCurrentConnectWithError =  ():Promise<ObjConnection> => {
    console.log(TAG, 'fetchCurrentConnectWithError begin ------');
    
    let pro = async()=>{
      const funcName = 'fetchCurrentConnectWithError';
      let errorSSID = null;
      try {
        let SSID =  await WifiManager.getCurrentWifiSSID().catch(error=>{
          DeviceLog.logInfo(`${TAG} WifiManager.getCurrentWifiSSID() error =${error?.message}`);
          errorSSID = error;
        });

        if(_.isEmpty(SSID)){
          const state = await NetInfo.fetch().catch(console.log);
          const {isConnected = false, isInternetReachable = false,details =null} = state ??{};
          const { ipAddress = '',isConnectionExpensive = false,ssid='' } = details ??{};
          SSID =  ssid;
          
        }
      
        DeviceLog.logInfo(`${TAG} fetchCurrentConnectWithError ssid=${SSID}-${errorSSID?.message}`);
        _.isEmpty(SSID) && !errorSSID && throw errorSSID;
        
        SSID = _.isEqual('Cannot detect SSID',SSID) || _.isEqual('<unknown ssid>',SSID) ?'':SSID;
        console.log(TAG, 'fetchCurrentConnectWithError getSSID=', SSID);
        if(!_.isEmpty(SSID)){
          this.currentConnect = new ObjConnection();
          this.currentConnect.id = SSID;
          this.currentConnect.name = SSID;        
          console.log(TAG,'Your current connected wifi SSID is ' + SSID);
          return this.currentConnect;
        }
      } catch (error) {
        console.log(TAG,'Cannot get current SSID!', error);
        APIService.trackLog({action:funcName, message:`error catch ${error?.message}`,rawData:`errorMessage=${error.message??''}`});
        new ExHandler(new CustomError(knownCode.node_can_not_get_wifi_name),error?.message).throw();
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
      const funcName = `${TAG}-connectDevice`;
      let SSID = wifiObj?.name??'';
      const password = wifiObj?.password || PASS_HOSPOT;
      try {
        
        const logHandler = new ExHandler(new CustomError(knownCode.node_can_not_connect_hotspot));
        console.log(TAG, 'connectDevice begin000 --- name = ',SSID);
        
        DeviceLog.logInfo(`${TAG} connectDevice ssid=${SSID}-pass=${password}`);
        let data = await WifiManager.connectToProtectedSSID(SSID,password,false).catch(e=>{
          console.log(TAG, 'connectToProtectedSSID begin --- error ,',e);
          DeviceLog.logInfo(`${TAG} connectDevice connectToProtectedSSID error ${e?.message}`);
          APIService.trackLog({action:funcName, message:`connectToProtectedSSID error catch ${SSID} -pass=${password}`,rawData:`errorMessage=${e.message??''}`});
          logHandler.throw();
        });
        
        console.log(TAG, 'connectDevice begin111 --- data = ',data);
        await Util.delay(3);
        // isForceUse Wifi
        // if(Platform.OS == 'android'){
        //   try {
        //     WifiManager.forceWifiUsage(true);  
        //   } catch (error) {
        //     console.log(TAG, 'connectDevice forceWifiUsage error = ',error);
        //     DeviceLog.logInfo(`${TAG} connectDevice forceWifiUsage error ${error?.message}`);
        //   }
          
        // }
        if(_.isEmpty(data)){
          await Util.delay(3);
          data = await this.fetchCurrentConnectWithError().catch(e=>{
            e instanceof CustomError ? new ExHandler(e).throw():null;
          });
          console.log(TAG, 'connectDevice begin222--- data = ',data);
          DeviceLog.logInfo(`${TAG} connectDevice data.name=${data?.name||''}`);
          if(_.isEmpty(data)){
            // IOS 13.2
            // await Util.delay(3);
            // data = await this.isConnectedWithNodeHotspot();
            // logHandler.throw();
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
