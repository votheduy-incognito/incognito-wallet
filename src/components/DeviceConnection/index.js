import LocalDatabase from '@src/utils/LocalDatabase';
import Util from '@src/utils/Util';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Alert, Platform, View } from 'react-native';
import BaseConnection from './BaseConnection';
import style from './style';
import WifiConnection from './WifiConnection';

export const TAG = 'DeviceConnection';

class DeviceConnection extends Component {
  _listeners = [];

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isDoingSetManual: false,
      pairedDevice: []
    };
    
    this.init();
    
  }
  init = ()=>{
    const connection:BaseConnection = new WifiConnection();
    this.connection = connection;
  }

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

  selectDevice = async (selectedDevice = {}) => {
    console.log(TAG, 'selectDevice begin = ', selectedDevice);
  };

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

  checkRegular = async ()=>{
    try {
      const isRegular = await this.connection.checkRegular();
      return Promise.resolve(isRegular);
    } catch (error) {
      return Promise.reject(error);
    }
    return Promise.resolve(true);
  }
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
        console.log(TAG, 'scan -- begin');
        // const [isEnabled, granted] = await Promise.all([
        //   this.checkRegular(),
        //   Permission.locationPermission()
        // ]);
        const devices = await this.connection.scan();
        callbackGettingListPairedDevices(devices);
        console.log(TAG, 'scan -- enabled01 =', devices);
        
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
  callbackGettingListPairedDevices: pairedList => {}
};

DeviceConnection.defaultProps = {
  callbackGettingListPairedDevices: PropTypes.func
};
export default DeviceConnection;
