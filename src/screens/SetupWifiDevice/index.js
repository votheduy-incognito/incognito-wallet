/**
 * @providesModule SetupWifiDevice
 */
import routeNames from '@routers/routeNames';
import LocalDatabase from '@utils/LocalDatabase';
import APIService from '@services/api/miner/APIService';
import { CONSTANT_MINER } from '@src/constants';
import FirebaseService, {
  FIREBASE_PASS,
  MAIL_UID_FORMAT
} from '@services/FirebaseService';
import Loader from '@components/DialogLoader';
import _ from 'lodash';
import React from 'react';
import {
  Keyboard,
  NativeModules,
  NetInfo,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import WifiConnection from '@components/DeviceConnection/WifiConnection';
import { connect } from 'react-redux';
import ZMQService from 'react-native-zmq-service';
import BaseScreen from '@screens/BaseScreen';
import { Button } from 'react-native-elements';
import Util from '@src/utils/Util';
import { onClickView } from '@src/utils/ViewUtil';
import styles from './style';

export const TAG = 'SetupWifiDevice';

const TIMES_VERIFY = 5;

class SetupWifiDevice extends BaseScreen {
  static navigationOptions = {
    title: 'WI-FI CONNECTION'
  };

  constructor(props) {
    super(props);
    const {params} = props.navigation.state;
    const currentConnect = params.currentConnect||null;
    this.state = {
      validSSID: false,
      validWPA: false,
      ssid: currentConnect?.name||'',
      wpa: '',
      errorMessage: '',
      verifyCode: '',
      counterVerify: 0,
      latitude: null,
      longitude: null,
      loading: false,
      isLoadingSetupWifi:false,
      isConnected: false,
      showModal: false,
      validWallName: false,
      wallName: '',
      addProduct: null
    };
    this.modal3 = React.createRef();
    this.wifiConnection = new WifiConnection();
  }

  renderDeviceName=()=>{
    const { container, textInput, item, errorText } = styles;
    const {
      showModal,
      validWallName,
    } = this.state;
    if(!showModal){
      return null;
    }
    
    return (
      <View style={[styles.modal, styles.modal3]}>
        {validWallName ? null : (
          <Text style={[errorText]}>* Please enter name</Text>
        )}
        <TextInput
          underlineColorAndroid="transparent"
          style={[textInput, item]}
          placeholder="Device name"
          onChangeText={text => this.validWallName(text)}
        />
        <Button
          title="Submit"
          onPress={this.handleSubmit}
          titleStyle={styles.textTitleButton}
          buttonStyle={styles.button}
        />
      </View>
    );
  }

  renderWifiPassword=()=>{
    const { container, textInput, item, errorText } = styles;
    const {
      validSSID,
      validWPA,
      ssid,
      errorMessage,
    } = this.state;
    return (
      <View style={[styles.modal, styles.modal3]}>
        {validSSID && validWPA ? null : (
          <Text style={[errorText]}>
        * Please type a Wi-Fi name and its password to connect Miner to the
        Internet
          </Text>
        )}

        {errorMessage.length > 0 ? (
          <Text style={[errorText]}>*{errorMessage}</Text>
        ) : null}
        <TextInput
          underlineColorAndroid="transparent"
          style={[textInput, item]}
          placeholder="Wi-Fi name"
          value={ssid}
          onChangeText={text => this.validSSID(text)}
        />
        <TextInput
          underlineColorAndroid="transparent"
          style={[textInput, item]}
          secureTextEntry
          placeholder="Password"
          onChangeText={text => this.validWPA(text)}
        />
        
        <Button
          titleStyle={styles.textTitleButton}
          buttonStyle={styles.button}
          onPress={this.handleSetUpPress}
          title='Setup'
        />
      </View>
    );
  }

  handleSetUpPress = onClickView(async ()=>{
    await this.checkConnectHotspot();
  });
  handleSubmit = onClickView(async() => {
    this.closeModal();
  });

  render() {
    const { container, textInput, item, errorText } = styles;
    const {
      loading
    } = this.state;
    
    return (
      <View style={container}>
        {this.renderDeviceName()}
        <Loader loading={loading} />
        {this.renderWifiPassword()}
      </View>
    );
  }
  async connectZMQAndroid(params) {
    let data = JSON.stringify(params);
    ZMQService.sendData(data);

    this.setState({
      counterVerify: 0
    });
    NetInfo.isConnected
      .fetch()
      .then()
      .done(() => {
        NetInfo.isConnected.addEventListener(
          'change',
          this._handleConnectionChange
        );
      });

    setTimeout(() => {
      this.callVerifyCode();
    }, 23 * 1000);
  }
  
  validWallName(text) {
    const isValid = text.length > 0 ? true : false;
    this.setState({
      wallName: text,
      validWallName: isValid
    });
  }
  validSSID(text) {
    const isValid = text.length > 0 ? true : false;
    this.setState({
      ssid: text,
      validSSID: isValid
    });
  }
  validWPA(text) {
    const isValid = text.length >= 6 ? true : false;
    this.setState({
      wpa: text,
      validWPA: isValid
    });
  }
  sendZMQ = async ()=> {
    const { validSSID, validWPA, ssid, wpa, longitude, latitude } = this.state;
    if (validSSID && validWPA) {
      Keyboard.dismiss();

      this.setState({
        loading: true
      });
      const deviceId = DeviceInfo.getUniqueID();
      var date = new Date();
      const verify_code = `${deviceId}.${date.getTime()}`;
      console.log(TAG,'sendZMQ Verify Code: ', verify_code);
      const userJson = await LocalDatabase.getUserInfo();
      console.log(TAG, 'UserJson:', userJson);
      if (userJson) {
        const user = userJson.toJSON();
        const {
          email,
          fullname,
          id,
          token,
          phone,
          user_hash,
          gender,
          credit,
          last_update_task,
          created_at,
          country,
          birth,
          city,
          code,
          products
        } = user;

        const params = {
          action: 'send_wifi_info',
          ssid: ssid,
          wpa: wpa,
          product_name:CONSTANT_MINER.PRODUCT_NAME,
          product_type: CONSTANT_MINER.PRODUCT_TYPE,
          source: 'ios',
          verify_code: verify_code,
          address: 'NewYork',
          address_long: 0.0,
          address_lat: 0.0,
          platform: CONSTANT_MINER.PRODUCT_TYPE,
          // time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          // timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          time_zone: DeviceInfo.getTimezone(),
          timezone: DeviceInfo.getTimezone(),
          user_id: id,
          email: email,
          fullname: fullname,
          id: id,
          token: token,
          user_hash: user_hash,
          last_update_task: last_update_task,
          birth: birth,
          city: city,
          code: code,
          country: country,
          created_at: created_at,
          credit: credit,
          gender: gender,
          phone: phone
        };
        console.log(TAG, 'Params:', JSON.stringify(params));
        console.log(TAG, 'Platform OS:', Platform.OS);
        this.setState({
          verifyCode: verify_code
        });
        if (Platform.OS == 'ios') {
          await this.connectZMQiOS(params);
        } else {
          console.log('Send ZMQ Android');
          //ZMQService.sendData(JSON.stringify(params));
          this.connectZMQAndroid(params);
          /*
          var ZeroMQ  = require('react-native-zeromq') ;
          ZeroMQ.socket(ZeroMQ.SOCKET_TYPE.DEALER).then((socket) => {
            socket.connect("tcp://52.3.101.47:5004").then(() => {
              socket.send(JSON.stringify(params)).then(() => {
                socket.recv().then((msg) => {
                  console.log('Send zmq successfully')

                  console.log(msg);
                });
              });
            });
          });
          */
        }
      }
    }
  }
  connectZMQiOS= async (params) =>{
    try {
      const res = await ZMQService.sendData(JSON.stringify(params));
      if(_.isEmpty(res)) return;
      console.log(TAG,'Send zmq successfully res',res);

      this.setState({
        counterVerify: 0
      });

      NetInfo.isConnected
        .fetch()
        .then()
        .done(() => {
          NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectionChange
          );
        });

      // setTimeout(() => {
      // this.callVerifyCode();
      // }, 20 * 1000);
      await Util.timeout(this.callVerifyCode,20);
    } catch (error) {
      console.log(TAG,'Send zmq error',error);
    }
    // ZMQService.sendData(JSON.stringify(params)).then(res => {
    //   console.log(TAG,'Send zmq successfully res',res);

    //   this.setState({
    //     counterVerify: 0
    //   });

    //   NetInfo.isConnected
    //     .fetch()
    //     .then()
    //     .done(() => {
    //       NetInfo.isConnected.addEventListener(
    //         'connectionChange',
    //         this._handleConnectionChange
    //       );
    //     });

    //   setTimeout(() => {
    //     this.callVerifyCode();
    //   }, 20 * 1000);
    // });
  }

  _handleConnectionChange = isConnected => {
    console.log('_handleConnectionChange:', isConnected);
    this.setState({
      isConnected: isConnected
    });
  };
  closeModal =()=> {
    if (this.validWallName) {
      const { addProduct } = this.state;
      this.setState(
        {
          showModal: false
        },
        () => this.changeDeviceName(addProduct)
      );
    }
  }
  changeDeviceName = async (product) => {
    this.setState({
      loading: true
    });
    const { wallName } = this.state;
    let params = {
      product_id: product.product_id,
      product_name: wallName
    };
    try {
      const response = await APIService.updateProduct(params);

      const { status } = response;
      if (status) {
        console.log('Change name = ', response);
        this.setState({
          loading: false
        });
        this.goToScreen(routeNames.HomeMine);
      }
    } catch (error) {
      this.setState({
        loading: false
      });
      this.onPressBack();
    }
  }
  checkConnectHotspot = async  ()=> {
    const { validSSID, validWPA } = this.state;

    if (validSSID && validWPA) {
      let ssid = this.wifiConnection.currentConnect?.name?.toLowerCase()||'';
      const product = CONSTANT_MINER.PRODUCT_TYPE.toLowerCase();
      console.log('SSID---: ', ssid);
      if (_.includes(ssid, product)) {
        this.sendZMQ();
      } else {
        this.setState({
          errorMessage: ' Please connect The Miner Hotspot'
        });
      }
    }
  }
  getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log('Position:', position);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          errorMessage: ''
        });
      },
      error => {
        console.log('Error:', error);
        this.setState({ errorMessage: error.message });
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  callVerifyCode = async()=> {
    console.log(TAG,' callVerifyCode begin');
    const { verifyCode, counterVerify, isConnected } = this.state;
    console.log(TAG,' callVerifyCode begin01 connected = ',isConnected);
    if (isConnected) {
      const params = {
        verify_code: verifyCode
      };
      console.log(TAG,' callVerifyCode begin 02');
      try {
        const response = await APIService.verifyCode(params);
        console.log(TAG, 'Verify Code Response: ', response);
        const { status } = response;
        if (status == 1) {
          console.log('Get Product successfully');
          NetInfo.isConnected.removeEventListener(
            'connectionChange',
            this._handleConnectionChange
          );
          this.setState({
            loading: false
          });
          const { product } = response.data;
          if (product) {
            this.setState({
              addProduct: product
            });
            this.showPopupEditName();
            this.authFirebase(product);
          }
        } else {
          this.failedVerifyCode();
        }
      } catch (error) {
        console.log('Error try catch:', error);
        this.failedVerifyCode();
      }
    } else {
      this.failedVerifyCode();
    }

    console.log('Counter: ', counterVerify + 1);
    this.setState({
      counterVerify: counterVerify + 1
    });
  }
  failedVerifyCode() {
    const { verifyCode, counterVerify, isConnected } = this.state;
    if (counterVerify < TIMES_VERIFY) {
      setTimeout(() => {
        this.callVerifyCode();
      }, 12 * 1000);
    } else {
      NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this._handleConnectionChange
      );
      this.setState({
        loading: false,
        errorMessage: 'Can\'t connect The Miner. Please check the internert information and try again'
      });
    }
  }
  showPopupEditName=()=> {
    this.setState({
      showModal: true
    });
  }

  authFirebase=(product) =>{
    // const autonomousContext = AutonomousContext.getShareManager();
    // autonomousContext.setActiveDevice(product);
    let productId = product.product_id;
    const firebase = FirebaseService.getShareManager();
    let mailProductId = `${productId}${MAIL_UID_FORMAT}`;
    let password = `${FIREBASE_PASS}`;
    firebase.auth(
      mailProductId,
      password,
      uid => {
        console.log('Firebase login successfully: ', uid);
      },
      error => {
        console.log('Firebase login error: ', error);
      }
    );
  }
}

SetupWifiDevice.propTypes = {};

SetupWifiDevice.defaultProps = {};
export default connect(
  state => ({}),
  dispatch => ({

  })
)(SetupWifiDevice);
