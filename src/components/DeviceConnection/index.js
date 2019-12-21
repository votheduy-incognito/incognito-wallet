import NetInfo from '@react-native-community/netinfo';
import Util from '@utils/Util';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import BaseConnection, { ObjConnection } from './BaseConnection';
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

  getCurrentConnect = async ():Promise<ObjConnection> => {
    // await Util.delay(3);
    console.log(TAG, 'getCurrentConnect begin ', this.connection.currentConnect);

    const currentConnect =  await this.connection.fetchCurrentConnect();
    console.log(TAG, 'getCurrentConnect end ', currentConnect);
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
    const connection: BaseConnection = new WifiConnection();
    this.connection = connection;
  };

  connectAWifi = async (device: ObjConnection) => {
    console.log(TAG, 'connectAWifi begin  = ',JSON.stringify(device)||'');
    let result = await this.connection.connectDevice(device).catch(console.log)??false;
    return result;
  };

  connectDevice = async (device: ObjConnection,isHOTPOST = false) => {
    console.log(TAG, 'connectDevice begin  = ',JSON.stringify(device)||'');
    let result = await this.connection.connectDevice(device);//.catch(e=>e instanceof CustomError? new ExHandler(e).throw():null)??false;

    if(result){
      // console.log(TAG, 'connectDevice begin true ---- ');
      const checkConnectWifi = async ()=>{
        const state = await NetInfo.fetch().catch(console.log);
        const {isConnected = false, isInternetReachable = false, details: 
          { ipAddress= '',
            subnet= '',
            ssid='',
            isConnectionExpensive= false }} = state ??{};
        console.log(TAG, 'connectDevice begin 0000 ---- ',state);
        let isConnectedCombined  = false;
        // if(Platform.OS == 'ios'){
        //   isConnectedCombined = isHOTPOST?((_.includes(ipAddress,'10.42.') || !isInternetReachable ) && isConnected):isConnected;
        // }else{
        //   isConnectedCombined = isHOTPOST?(_.includes(ipAddress,'10.42.') && isConnected):isConnected;
        // }

        isConnectedCombined = isHOTPOST?(await this.isConnectedWithNodeHotspot() && isConnected):isConnected;
        
        console.log(TAG, 'connectDevice begin 111---- ',isConnectedCombined);
        return isConnectedCombined?isConnectedCombined : new Error('have not connected ');
      };

      result = await Util.tryAtMost (checkConnectWifi,25,2);
      console.log(TAG, 'connectDevice begin 01 result =  ',result);
    }
    return result;
  };
  isConnectedWithNodeHotspot = ():Promise<Boolean>=>{
    return this.connection.isConnectedWithNodeHotspot();
  }
  removeConnectionDevice = async (device: ObjConnection) => {
    // console.log(TAG, 'removeConnectionDevice begin result = ',JSON.stringify(device)||'');
    let result = Platform.OS =='android'? await this.connection.removeConnection(device):true;
    // let result = await this.connection.removeConnection(device);
    console.log(TAG, 'removeConnectionDevice begin result = ',result);
    return result;
  };


  selectDevice = async (selectedDevice = {}) => {
    console.log(TAG, 'selectDevice begin = ', selectedDevice);
  };

  saveItemConnectedInLocal = selectedDevice => {
    // const { callbackGettingListPairedDevices } = this.props;
    // if (Platform.OS === 'ios') {
    //   const address = !_.isEmpty(selectedDevice) ? selectedDevice.url : '';
    //   const name = !_.isEmpty(selectedDevice) ? selectedDevice?.name : '';
    //   LocalDatabase.savePrinterWifiAddress(address, name);
    //   callbackGettingListPairedDevices([{ name, address, checked: true }]);
    // } else {
    //   console.log(TAG, 'saveItemConnectedInLocal begin ', selectedDevice);
    //   // save bluetooth
    //   let { pairedDevice } = this.state;
    //   const address = selectedDevice?.address;
    //   const name = selectedDevice?.name;
    //   const itemIndex = pairedDevice.findIndex(
    //     item => item.address === selectedDevice.address
    //   );
    //   if (itemIndex > -1) {
    //     pairedDevice[itemIndex].checked = true;
    //   } else {
    //     pairedDevice = [...pairedDevice, { name, address, checked: true }];
    //   }
    //   console.log(TAG, 'saveItemConnectedInLocal begin01 ', pairedDevice);
    //   callbackGettingListPairedDevices(pairedDevice);
    // }
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
    // const { callbackGettingListPairedDevices } = this.props;

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
