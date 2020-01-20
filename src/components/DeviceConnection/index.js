import NetInfo from '@react-native-community/netinfo';
import APIService from '@src/services/api/miner/APIService';
import Util from '@utils/Util';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import BaseConnection, { ObjConnection } from './BaseConnection';
// import IOTWifiConnection from './IOTWifiConnection';
import style from './style';
import WifiConnection from './WifiConnection';

export const TAG = 'DeviceConnection';

class DeviceConnection extends Component {
  _listeners = [];

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isDoingSetManual: false
    };

    this.init();
  }

  /**
   * timeout 3s
   * return {ObjConnection|| null}
   */
  getCurrentConnect = async ():Promise<ObjConnection> => {
    const currentConnect =  await this.connection.fetchCurrentConnect().catch(console.log);
    return currentConnect;
  };

  componentDidMount = async () => {
    const listDevice = await this.getDeviceSavedList();
    if (_.isEmpty(listDevice)) {
      this.scan();
    }
  };

  set isDoingSetManual(isDoingSetManual) {
    this.setState({
      isDoingSetManual
    });
  }

  set isLoading(isLoading) {
    this.setState({
      loading: isLoading
    });
  }

  get isLoading() {
    const { loading } = this.state;
    return loading;
  }

  init = () => {
    // const connection: BaseConnection = Platform.OS == 'android'?new IOTWifiConnection() : new WifiConnection();
    const connection: BaseConnection = new WifiConnection();
    this.connection = connection;
  };

  connectAWifi = async (device: ObjConnection) => {
    const wifiName = device?.name||'';
    let result = false;
    if(!_.isEmpty(wifiName)){
      const wifiCurrent = await this.getCurrentConnect();
      const isConnected = _.isEqual(wifiName,wifiCurrent?.name);
      console.log(TAG, 'connectAWifi begin  = ',wifiName);
      result = isConnected? true : await this.connection.connectDevice(device).catch(async e=>{
        console.log(TAG, 'connectAWifi ERRRORRR  = ',wifiName);
        await this.connection.connectLastConnection(wifiName);
      });
    }
    return result??false;
  };

  connectDevice = async (device: ObjConnection,isHOTPOST = false) => {
    console.log(TAG, 'connectDevice begin  = ',JSON.stringify(device)||'');
    let result = await this.connection.connectDevice(device);//.catch(e=>e instanceof CustomError? new ExHandler(e).throw():null)??false;

    if(result){
      // console.log(TAG, 'connectDevice begin true ---- ');
      const checkConnectWifi = async ()=>{
        let isConnectedCombined = false;
        if(isHOTPOST){
          isConnectedCombined  = await this.isConnectedWithNodeHotspot();
        }else{
          const state = await NetInfo.fetch().catch(console.log);
          const {isConnected = false, isInternetReachable = false, details: 
            { ipAddress= '',
              subnet= '',
              ssid='',
              isConnectionExpensive= false }} = state ??{};
          console.log(TAG, 'connectDevice begin 0000 ---- ',state);
          isConnectedCombined  = isConnected;
        }
        
        console.log(TAG, 'connectDevice begin 111---- ',isConnectedCombined);
        return isConnectedCombined?isConnectedCombined : new Error('have not connected ');
      };

      result = await Util.tryAtMost (checkConnectWifi,25,2);
      console.log(TAG, 'connectDevice begin 01 result =  ',result);
    }
    return result;
  };
  isConnectedWithNodeHotspot = async ():Promise<Boolean>=>{
    try {
      return await APIService.pingHotspot();
    } catch (error) {
      return null;
    }
  }
  removeConnectionDevice = async (objConnection: ObjConnection) => {
    // console.log(TAG, 'removeConnectionDevice begin result = ',JSON.stringify(device)||'');
    // let result = Platform.OS =='android'? await this.connection.removeConnection(objConnection):true;
    let result = await Util.excuteWithTimeout(this.connection.removeConnection(objConnection),4).catch(console.log);
    console.log(TAG, 'removeConnectionDevice begin result = ',result);
    return result;
  };


  selectDevice = async (selectedDevice = {}) => {
    console.log(TAG, 'selectDevice begin = ', selectedDevice);
  };

  checkRegular = async () => {
    try {
      const isRegular = await this.connection.checkRegular();
      return isRegular;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  setMannual = () => {
    const { isDoingSetManual } = this.state;
    if (!isDoingSetManual) {
      this.isDoingSetManual = true;
    }
  };

  getDeviceSavedList = async () => {
    return [];
  };

  scan = async () => {
    if (!this.isLoading) {
      const { callbackGettingListPairedDevices } = this.props;
      this.isLoading = true;
      try {
        // console.log(TAG, 'scan -- begin');
        // const [isEnabled, granted] = await Promise.all([
        //   this.checkRegular(),
        //   Permission.locationPermission()
        // ]);
        const devices = await this.connection.scan();
        callbackGettingListPairedDevices(devices);
        // console.log(TAG, 'scan -- enabled01 =', devices);
      } catch (e) {
        console.log(TAG, 'scan error ', e);
      }
      this.isLoading = false;
    }
  };

  render() {
    return <View style={style.container} />;
  }
}

DeviceConnection.propTypes = {
  callbackGettingListPairedDevices: PropTypes.func
};

DeviceConnection.defaultProps = {
  callbackGettingListPairedDevices: pairedList => {}
};
export default DeviceConnection;
