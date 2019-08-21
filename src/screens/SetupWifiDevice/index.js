/**
 * @providesModule SetupWifiDevice
 */
import routeNames from '@routers/routeNames';
import LocalDatabase from '@utils/LocalDatabase';
import APIService from '@services/api/miner/APIService';
import { CONSTANT_MINER } from '@src/constants';
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
import CreateAccount from '@screens/CreateAccount';
import StepIndicator from 'react-native-step-indicator';
import styles from './style';

export const TAG = 'SetupWifiDevice';
const HOTPOT = 'TheMiner';
const errorMessage = 'Can\'t connect The Miner. Please check the internert information and try again';
const TIMES_VERIFY = 5;
const labels = ['Connect Hotpot','Send Wifi Info','Verify Code'];
const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize:30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#fe7013',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#fe7013',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#fe7013',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#fe7013'
};
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
      isDoingSetUp:false,
      errorMessage: '',
      verifyCode: '',
      counterVerify: 0,
      latitude: null,
      longitude: null,
      currentPositionStep:0,
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
      showModal,
      currentPositionStep,
      isDoingSetUp,
    } = this.state;
    if(showModal){
      return null;
    }
    // let isDoingSetUp = true;
    
    return (
      isDoingSetUp? (
        <StepIndicator
          direction='vertical'
          stepCount={labels.length}
          customStyles={customStyles}
          currentPosition={currentPositionStep}
          labels={labels}
        />
      ):(
        <View style={[styles.modal, styles.modal3]}>
          
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
      )
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
        CurrentPositionStep:0,
        isDoingSetUp:true,
        errorMessage:''
      });
      
      const resultStep1 = await this.checkConnectHotspot();
      let callVerifyCode = this.callVerifyCode;
      this.CurrentPositionStep = 2;
      const resultStep2  = (resultStep1 && await Util.tryAtMost(callVerifyCode,TIMES_VERIFY)) || false;
      console.log(TAG,'handleSetUpPress callVerifyCode end =======',resultStep2);
      errorMsg = resultStep2 ? '':errorMessage;
    } catch (error) {
      errorMsg = errorMessage;
      console.log(TAG,'handleSetUpPress error: ', error);
    }finally{
      this.setState({
        loading: false,
        currentPositionStep:0,
        isDoingSetUp:false,
        errorMessage:errorMsg
      });
    }
    
  });

  handleSubmit = onClickView(async() => {
    let errMessage = '';
    try {
      this.setState({
        loading: true
      });
      const {addProduct} = this.state;
      let fetchProductInfo = {};
      if (this.validWallName) {
        fetchProductInfo = await this.changeDeviceName(addProduct);
        const listResult =  await this.saveProductList();
        // console.log(TAG,'handleSubmit saved - listResult = ',listResult);
      }
      if(!_.isEmpty(fetchProductInfo)){
        // create account
        // console.log(TAG,'handleSubmit fetchData = ',fetchProductInfo);
        let result = await this.viewCreateAccount?.current?.createAccount(fetchProductInfo.product_name);
        const {PrivateKey = '',AccountName = '',PaymentAddress = ''} = result;
        result = await DeviceService.sendPrivateKey(Device.getInstance(addProduct),PrivateKey);

        if(!_.isEmpty(result)){
          this.goToScreen(routeNames.HomeMine);
          return;
        }
      }
      errMessage = errorMessage;
      
    } catch (error) {
      console.log(TAG,'handleSubmit error');
      this.onPressBack();
    }
    this.setState({
      loading: false,
      showModal: false,
      errorMessage:errMessage
    });
    
  });
  saveProductList = async () =>{
    
    try {
      const response = await APIService.getProductList(true);
      const { status, data } = response;
      if (status == 1) {
        // console.log(TAG,'saveProductList begin data = ',data);
        await LocalDatabase.saveListDevices(data);
        return data;
      }
    } catch (error) {
      return undefined;
    }
  }

  render() {
    const { container, textInput, item, errorText } = styles;
    const {
      loading
    } = this.state;
    
    return (
      <View style={container}>
        <DeviceConnection ref={this.deviceId} />
        {this.renderDeviceName()}
        <Loader loading={loading} />
        {this.renderWifiPassword()}
        {this.renderToastMessage()}
        
        <View style={{width: 0,height: 0}}>
          <CreateAccount ref={this.viewCreateAccount} />
        </View>
      </View>
    );
  }

  validWallName(text) {
    const isValid = !_.isEmpty(text);
    this.setState({
      wallName: text,
      validWallName: isValid
    });
  }
  validSSID(text) {
    const isValid = !_.isEmpty(text);
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
        
        this.setState({
          verifyCode: verify_code
        });
        let result = await this.connectZMQ(params);
        return result;
      }
    }
    return false;
  }
  
  connectZMQ = async (params) =>{
    try {
      this.isSendDataZmqSuccess = false;
      const res = await ZMQService.sendData(JSON.stringify(params));
      if(_.isEmpty(res)) return false;
      console.log(TAG,'Send zmq successfully res',res);
      this.isSendDataZmqSuccess = true;
     
      const checkConnectWifi = async ()=>{
        let isConnected = false;
        while(!isConnected){
          isConnected = await NetInfo.isConnected.fetch() && this.isHaveNetwork;
        }
        
        return isConnected;
      };

      const result = await Util.excuteWithTimeout(checkConnectWifi(),30);
      console.log(TAG, 'connectZMQ begin end  ',result);
      return result;
      
    } catch (error) {
      console.log(TAG,'Send zmq error',error);
    }

    return false;
    
  }

  _handleConnectionChange = async (isConnected) => {
    
    let device = isConnected && await this.deviceId?.current?.getCurrentConnect();
    this.isHaveNetwork = !_.isEmpty(device?.name||'') && !_.isEqual(device?.name||'', HOTPOT);
    console.log(TAG,`_handleConnectionChange: ${this.isHaveNetwork} ,name = ${device?.name}`);
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
        console.log(TAG,'Change name = ', response);
        params={...params,...data};
      }
      return params;
    } catch (error) {
      console.log(TAG,'changeDeviceName error');
    }
    return null;
  }
  set CurrentPositionStep(index:Number){
    this.setState({
      currentPositionStep:index
    });
  }
  checkConnectHotspot = async  ()=> {
    
    const { validSSID, validWPA } = this.state;

    let device = await this.deviceId?.current?.getCurrentConnect();
    
    let isConnectedHotpost = !_.isEmpty(device?.name||'') && _.isEqual(device?.name||'', HOTPOT);
    this.CurrentPositionStep = 0;
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
        this.CurrentPositionStep = 1;
        let result = await Util.excuteWithTimeout(this.sendZMQ(),120);
        
        return result;
      } 
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
    const errorObj = new Error('callVerifyCode fail');
    if (this.isHaveNetwork) {
      // this.setState({
      //   loading: true
      // });
      const params = {
        verify_code: verifyCode
      };
      console.log(TAG,' callVerifyCode begin 02');
      try {
        const response = await APIService.verifyCode(params);
        console.log(TAG, 'callVerifyCode Verify Code Response: ', response);
        const { status } = response;
        if (status == 1) {
          console.log('Get Product successfully');
          const { product } = response.data;
          if (product) {
            this.setState({
              addProduct: product,
              showModal:true
            });
            await DeviceService.authFirebase(product);
            return true;
          }
        } else {
          await Util.delay(2);
          // await this.failedVerifyCode();
        }
      } catch (error) {
        console.log('Error try catch:', error);
        // await this.failedVerifyCode();
      }
    }
    return errorObj;

    // console.log('Counter: ', counterVerify + 1);
    // this.setState({
    //   counterVerify: counterVerify + 1
    // });
  }
  // failedVerifyCode() {
  //   const { verifyCode, counterVerify, isConnected } = this.state;
  //   if (counterVerify < TIMES_VERIFY) {
  //     setTimeout(() => {
  //       this.callVerifyCode();
  //     }, 12 * 1000);
  //   } else {
      
  //     this.setState({
  //       // loading: false,
  //       errorMessage: errorMessage
  //     });
  //   }
  // }

}

SetupWifiDevice.propTypes = {
  wallet: PropTypes.objectOf(PropTypes.object),
};
const mapDispatch = { };
SetupWifiDevice.defaultProps = {};
export default connect(
  state => ({}),
  mapDispatch
)(SetupWifiDevice);
