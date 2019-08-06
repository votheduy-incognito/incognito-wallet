import Util from '@utils/Util';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View,NetInfo } from 'react-native';
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

  connectDevice = async (device: ObjConnection) => {
    let result = await this.connection.connectDevice(device);
    console.log(TAG, 'connectDevice begin result = ',result);
    if(result){
      console.log(TAG, 'connectDevice begin ---- ');
      const checkConnectWifi = async ()=>{
        let isConnected = false;
        while(!isConnected){
          isConnected = await NetInfo.isConnected.fetch();
        }
        console.log(TAG, 'connectDevice begin 111---- ',isConnected);
        return isConnected;
      };

      result = await Util.excuteWithTimeout(checkConnectWifi(),5);
      console.log(TAG, 'connectDevice begin 01 result =  ',result);
    }
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
