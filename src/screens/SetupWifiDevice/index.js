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
  NetInfo,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import WifiConnection from '@components/DeviceConnection/WifiConnection';
import { connect } from 'react-redux';
import ZMQService from 'react-native-zmq-service';
import BaseScreen from '@screens/BaseScreen';
import { Button } from 'react-native-elements';
import Util from '@src/utils/Util';
import { onClickView } from '@src/utils/ViewUtil';
import { ObjConnection } from '@src/components/DeviceConnection/BaseConnection';
import DeviceConnection from '@src/components/DeviceConnection';
import DeviceService from '@src/services/DeviceService';
import Device from '@src/models/device';
import PropTypes from 'prop-types';
import { reloadAccountList } from '@src/redux/actions/wallet';
import accountService from '@src/services/wallet/accountService';
import CreateAccount from '@screens/CreateAccount';
import styles from './style';

export const TAG = 'SetupWifiDevice';
const HOTPOT = 'TheMiner';
const errorMessage = 'Can\'t connect The Miner. Please check the internert information and try again';
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
      validSSID: !_.isEmpty(currentConnect?.name),
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
    this.isSendDataZmqSuccess = false;
    this.isHaveNetwork = false;
    this.modal3 = React.createRef();
    this.deviceId = React.createRef();
    this.viewCreateAccount = React.createRef();
    this.wifiConnection = new WifiConnection();
  }

  componentDidMount(){
    super.componentDidMount();
    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
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
      showModal
    } = this.state;
    if(showModal){
      return null;
    }
    return (
      <View style={[styles.modal, styles.modal3]}>
        <DeviceConnection ref={this.deviceId} />
        { validSSID && validWPA ? null : (
          <Text style={[errorText,{color:'#000000'}]}>Please type a Wi-Fi name and its password to connect Miner to the Internet</Text>
        )}

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
        {!_.isEmpty(errorMessage) ? (
          <Text style={[errorText]}>*{errorMessage}</Text>
        ) : null}
        <Button
          titleStyle={styles.textTitleButton}
          buttonStyle={styles.button}
          onPress={this.handleSetUpPress}
          title='Setup'
        />
      </View>
    );
  }

  connectHotspot = async ()=>{
    
    const deviceMiner = new ObjConnection();
    deviceMiner.name = HOTPOT;
    deviceMiner.id = HOTPOT;
    const result:Boolean = await this.deviceId?.current?.connectDevice(deviceMiner) || false;
    console.log(TAG,'connectHotspot end result = ',result);
    return result?deviceMiner:null;
  }

  handleSetUpPress = onClickView(async ()=>{
    let errorMsg = '';
    try {
      this.setState({
        loading: true,
        errorMessage:''
      });
      
      const result = await this.checkConnectHotspot();
      errorMsg = result ? '':errorMessage;
    } catch (error) {
      errorMsg = errorMessage;
      console.log(TAG,'handleSetUpPress error: ', error);
    }finally{
      this.setState({
        loading: false,
        errorMessage:errorMsg
      });
    }
    
  });

  handleSubmit = onClickView(async() => {
    try {
      this.setState({
        loading: true
      });
      const {addProduct} = this.state;
      let fetchProductInfo = {};
      if (this.validWallName) {
        fetchProductInfo = await this.changeDeviceName(addProduct);
      }
      if(!_.isEmpty(fetchProductInfo)){
        // create account
        let result = await this.viewCreateAccount.current.createAccount(fetchProductInfo.product_name);
        await DeviceService.sendPrivateKey(Device.getInstance(addProduct));
        ////////
        // product_name
      }
      
    } catch (error) {
      console.log(TAG,'handleSubmit error');
    }finally{
      this.setState({
        loading: false,
        showModal: false
      });
    }
    
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
        {this.renderToastMessage()}
        <CreateAccount ref={this.viewCreateAccount} />
      </View>
    );
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
          source:  Platform.OS,
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
        await this.connectZMQ(params);
      }
    }
  }
  
  connectZMQ = async (params) =>{
    try {
      this.isSendDataZmqSuccess = false;
      const res = await ZMQService.sendData(JSON.stringify(params));
      if(_.isEmpty(res)) return;
      console.log(TAG,'Send zmq successfully res',res);

      this.setState({
        counterVerify: 0
      });
      this.isSendDataZmqSuccess = true;
     
      // await Util.delay(10);
      const checkConnectWifi = async ()=>{
        let isConnected = false;
        while(!isConnected){
          isConnected = await NetInfo.isConnected.fetch() && this.isHaveNetwork;
        }
        console.log(TAG, 'connectZMQ begin 111---- ',isConnected);
        return isConnected;
      };

      const result = await Util.excuteWithTimeout(checkConnectWifi(),30);
      if(result){
        this.callVerifyCode();
      }
      
    } catch (error) {
      console.log(TAG,'Send zmq error',error);
    }
    
  }

  _handleConnectionChange = async (isConnected) => {
    
    let device = isConnected && await this.deviceId?.current?.getCurrentConnect();
    this.isHaveNetwork = !_.isEqual(device?.name||'', HOTPOT);
    console.log('_handleConnectionChange:', this.isHaveNetwork);
    this.setState({
      isConnected: isConnected
    });
  };
  
  changeDeviceName = async (product) => {
    
    const { wallName } = this.state;
    let params = {
      product_id: product.product_id,
      product_name: wallName
    };
    try {
      const response = await APIService.updateProduct(params);

      const { status,data } = response;
      if (status === 1) {
        console.log('Change name = ', response);
        params={...params,...data};
      }
      return params;
    } catch (error) {
      console.log(TAG,'changeDeviceName error');
    }
    return null;
  }
  checkConnectHotspot = async  ()=> {
    
    const { validSSID, validWPA } = this.state;

    let device = await this.deviceId?.current?.getCurrentConnect();
    
    let isConnectedHotpost = _.isEqual(device?.name||'', HOTPOT);
    if(!isConnectedHotpost){
      device = await this.connectHotspot();
    }
    this.isHaveNetwork = false;
    isConnectedHotpost = !_.isEmpty(device);

    if (isConnectedHotpost && validSSID && validWPA) {
      let ssid = device?.name?.toLowerCase()||'';
      const product = CONSTANT_MINER.PRODUCT_TYPE.toLowerCase();
      console.log(TAG,'checkConnectHotspot SSID---: ', ssid);
      if (_.includes(ssid, product)) {
        await Util.excuteWithTimeout(this.sendZMQ(),60);
        return true;
      } else {
        // this.setState({
        //   errorMessage: ' Please connect The Miner Hotspot'
        // });
      }
    }else{
      // this.setState({
      //   errorMessage:errorMessage
      // });
    }
    return false;
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
    if (this.isHaveNetwork) {
      this.setState({
        loading: true
      });
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
          this.setState({
            loading: false
          });
          const { product } = response.data;
          if (product) {
            this.setState({
              addProduct: product,
              showModal:true
            });
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
      
      this.setState({
        loading: false,
        errorMessage: errorMessage
      });
    }
  }

  // createAccount = async (
  //   accountName = new Error('Account name is required')
  // ) => {
  //   try {
  //     const { wallet, reloadAccountList } = this.props;

  //     await accountService.createAccount(accountName, wallet);
  //     this.showToastMessage(`Your account ${accountName} was created!`);
  //     await reloadAccountList();
  //   } catch {
  //     this.showToastMessage('Create account failed');
  //   }
  // };

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

SetupWifiDevice.propTypes = {
  wallet: PropTypes.objectOf(PropTypes.object),
};
const mapDispatch = { reloadAccountList };
SetupWifiDevice.defaultProps = {};
export default connect(
  state => ({}),
  mapDispatch
)(SetupWifiDevice);
