/**
 * @providesModule SetupDevice
 */
import WifiConnection from '@components/DeviceConnection/WifiConnection';
import NetInfo from '@react-native-community/netinfo';
import routeNames from '@routers/routeNames';
import CreateAccount from '@screens/CreateAccount';
import APIService from '@services/api/miner/APIService';
import DeviceConnection from '@src/components/DeviceConnection';
import { ObjConnection } from '@src/components/DeviceConnection/BaseConnection';
import { CONSTANT_MINER } from '@src/constants';
import { DEVICES } from '@src/constants/miner';
import Device from '@src/models/device';
import { getAccountByName } from '@src/redux/selectors/account';
import { CustomError, ExHandler } from '@src/services/exception';
import knownCode from '@src/services/exception/customError/code/knownCode';
import NodeService from '@src/services/NodeService';
import SSHService from '@src/services/SSHService';
import Util from '@src/utils/Util';
import { onClickView } from '@src/utils/ViewUtil';
import LocalDatabase from '@utils/LocalDatabase';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Keyboard, Platform, Text, TextInput, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Button } from 'react-native-elements';
import { getTimeZone } from 'react-native-localize';
import StepIndicator from 'react-native-step-indicator';
import ZMQService from 'react-native-zmq-service';
import { connect } from 'react-redux';
import BaseComponent from '../BaseComponent';
import styles from './style';

export const TAG = 'SetupDevice';
const styleHideView = {
  opacity: 0,width: 0,height: 0
};
let HOTPOT = 'TheMiner';
const deviceTest ={ address: 'US',
  address_lat: 37.09024,
  address_long: -95.712891,
  address_street: null,
  city: null,
  common_name: null,
  country: null,
  country_code: null,
  created_at: 'Mon, 12 Aug 2019 07:47:04 GMT',
  created_from: 'ios',
  deleted: false,
  id: 3369,
  is_checkin: 1,
  neighborhood: null,
  platform: 'MINER',
  product_id: 'e799d259-ae06-4f64-b05b-8934d802b305',
  product_name: 'The Miner',
  region: null,
  route: null,
  state: null,
  state_code: null,
  street_number: null,
  timezone: 'Asia/Ho_Chi_Minh',
  town: null,
  user_id: 1425,
  verify_code: 'AFB94E64-3FFE-4D1D-BB6C-A757AFCF61BF.1565596011816',
  zip: null };
const errorMessage = 'Can\'t connect Node. Please check the internert information and try again';
const TIMES_VERIFY = 30;

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
class SetupDevice extends BaseComponent {

  constructor(props) {
    super(props);
    const {currentConnect} = props;
    const {name='',password=''} = currentConnect||{};
    console.log(TAG,'constructor currentConnect ',currentConnect);
    this.state = {
      currentConnect:currentConnect,
      validSSID: !_.isEmpty(name),
      validWPA: !_.isEmpty(password),
      ssid: name,
      wpa: password,
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
  static getDerivedStateFromProps(props, state) {
    if(!_.isEqual(props.currentConnect,state.currentConnect)){
      const {name='',password=''} = props.currentConnect||{};
      console.log(TAG,`getDerivedStateFromProps ${name} - ${password}`);
      return {
        currentConnect:props.currentConnect,
        validSSID: !_.isEmpty(name),
        validWPA: !_.isEmpty(password),
        ssid: name,
        wpa: password
      };
    }
  }
  async componentDidMount(){
    super.componentDidMount();
    // this.callVerifyCode();
    // hien.ton test 
    // const state = await NetInfo.fetch().catch(console.log);
    // const {isConnected = false, isInternetReachable = false} = state ??{};
    // console.log(TAG, 'componentDidMount state ',state);
    // this.authFirebase(deviceTest).then(data=>console.log('componentDidMount state ',data)).catch(console.warn);
    //////
    this.connection =  NetInfo.addEventListener(this._handleConnectionChange);
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    this.connection && this.connection();
  }

  renderDeviceName=()=>{
    const { textInput, item, errorText } = styles;
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

  renderStepDoingSetup=()=>{
    const { container, textInput, item, errorText } = styles;
    const {
      showModal,
      currentPositionStep,
      isDoingSetUp,
    } = this.state;
    if(!isDoingSetUp){
      return undefined;
    }
    return (
      <StepIndicator
        direction='vertical'
        stepCount={labels.length}
        customStyles={customStyles}
        currentPosition={currentPositionStep}
        labels={labels}
      />
    );
  }

  renderWifiPassword=()=>{
    const { container, textInput, item, errorText } = styles;
    const {
      validSSID,
      validWPA,
      ssid,
      wpa,
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
      isDoingSetUp? this.renderStepDoingSetup():(
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
            value={wpa}
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
    const errorObj = new Error('connectHotspot fail');
    try {
      // call api to get wifi's name    
      const response = await Util.excuteWithTimeout(APIService.qrCodeCheckGetWifi({QRCode:this.deviceIdFromQrcode}),3).catch(console.log);
      let {WifiName = '', Status= false} = response?.data ??{};
      this.deviceMiner = new ObjConnection();
      console.log(TAG,'connectHotspot begin0000 wifiname  = ',WifiName);
      if(_.isEmpty(WifiName)){
        let suffix = _.split(this.deviceIdFromQrcode,'-')[1];
        suffix = !_.isEmpty(suffix) && _.size(suffix) == 6 ?`-${suffix}`:'';
        
        WifiName = `${HOTPOT}${suffix}`;
        WifiName = `${HOTPOT}${suffix}`;
      }else{

        let name = _.split(WifiName,'-')[0];
        HOTPOT = name;
      }
      console.log(TAG,'connectHotspot begin end wifiname  = ',WifiName,'-HOTPOT = ',HOTPOT);
      this.deviceMiner.name = WifiName;
      this.deviceMiner.id = WifiName;

      
      const result = await this.deviceId?.current?.connectDevice(this.deviceMiner,true);
      console.log(TAG,'connectHotspot end result = ',result);
      return result?this.deviceMiner:errorObj;
    } catch (error) {
      if(error instanceof CustomError){
        console.log(TAG,'connectHotspot------ error ');
        new ExHandler(error).throw();
      }
      console.log(TAG,'connectHotspot error ');
    }

    return errorObj;

  }

  handleSetUpPress = onClickView(async (deviceIdFromQrcode='')=>{
    let errorMsg = '';

    try {
      this.setState({
        loading: true,
        CurrentPositionStep:0,
        isDoingSetUp:true,
        errorMessage:''
      });
      this.deviceIdFromQrcode = deviceIdFromQrcode;
      const resultStep1 = await this.checkConnectHotspot();
      if(!resultStep1){
        this.setState({
          currentPositionStep:1,
        });
      }
      let productInfo  = resultStep1 ? await this.tryVerifyCode():{} ;
      let resultFuid  = !_.isEmpty(productInfo) ? await this.authFirebase(productInfo):'' ;
      const isSaveNodeResult = !_.isEmpty(productInfo) && await this.saveProductList(productInfo);
      
      // this.CurrentPositionStep = 2;
      // let callVerifyCode = this.callVerifyCode;
      console.log(TAG,'handleSetUpPress callVerifyCode end =======',resultFuid);
      errorMsg = !_.isEmpty(resultFuid) ? '':errorMessage;
      
    } catch (error) {
      console.log(TAG,'handleSetUpPress error: ', error);
      if(error instanceof CustomError){
        console.log(TAG,'handleSetUpPress error01');
        errorMsg = error.message??errorMessage;
        new ExHandler(error).throw();
      }
    }finally{
      !_.isNil(this.deviceMiner) && this.deviceId?.current?.removeConnectionDevice(this.deviceMiner);
      // this.setState({
      //   loading: false,
      //   currentPositionStep:0,
      //   isDoingSetUp:false,
      //   errorMessage:errorMsg
      // });
      this.setState({
        loading: false,
        isDoingSetUp:false,
        errorMessage:errorMsg
      });
    }
    return errorMsg;
  });

  createAccount= async(accountName)=>{
    try {
      if(!_.isEmpty(accountName)){
        const {getAccountByName} = this.props;
        let accountNode = await getAccountByName(accountName);
        console.log(TAG,'createAccount begin name = ',accountName,'-isHaveAccount = ',!_.isEmpty(accountNode));
        // create account of node with qrcode
        accountNode = _.isEmpty(accountNode) ? await this.viewCreateAccount?.current?.createAccount(accountName):accountNode;
        return accountNode;
      }else{
        new ExHandler(new CustomError(knownCode.node_create_account_fail),'account name is empty').showWarningToast();
      }
    } catch (error) {
      new ExHandler(new CustomError(knownCode.node_create_account_fail)).showWarningToast();
    }
    return {};
  }

  
  changeDeviceName = async(name,qrCodeDevice=undefined,accountModel=undefined)=>{
    let errMessage = '';
    try {
      this.deviceIdFromQrcode = qrCodeDevice??this.deviceIdFromQrcode;
      const {addProduct} = this.state;
      let fetchProductInfo = {};
      if (this.validWallName && !_.isEmpty(addProduct) ) {
        console.log(TAG,'changeDeviceName begin name = ',name);
        fetchProductInfo = await this.updateDeviceNameRequest(addProduct.product_id,name)||{};
        fetchProductInfo = {
          ...fetchProductInfo,
          product_type:DEVICES.MINER_TYPE,
          minerInfo:{
            isCallStaked:false,
            qrCodeDeviceId:this.deviceIdFromQrcode,
          },
        };

        const isSaveNodeResult =  await this.saveProductList(fetchProductInfo);
        // console.log(TAG,'changeDeviceName saved - listResult = ',listResult);
      }
      if(!_.isEmpty(fetchProductInfo)){
        const {product_id} = fetchProductInfo;
        let result = !_.isEmpty(accountModel) ?accountModel: await this.createAccount(fetchProductInfo.product_name);
        const {PrivateKey = '',AccountName = '',PaymentAddress = '',PublicKeyCheckEncode='',ValidatorKey = ''} = result;
        console.log(TAG,'changeDeviceName sendValidatorKey begin');
        this.showLogConnect(`Begin: sendValidatorKey-ValidatorKey = ${ValidatorKey}`);
        result = await NodeService.sendValidatorKey(Device.getInstance(addProduct),ValidatorKey);
        this.showLogConnect(`Result: sendValidatorKey==> ${result?'SUCCESS':'FAIL'}`);
        const uid = result?.uid||'';
        console.log(TAG,'changeDeviceName sendValidatorKey begin01');
        // firebase_uid

        let resultRequest =  await Util.excuteWithTimeout(APIService.sendInfoStakeToSlack({productId:product_id,qrcodeDevice:this.deviceIdFromQrcode,miningKey:ValidatorKey,publicKey:PublicKeyCheckEncode,sendValidatorKey:result,paymentAddress:PaymentAddress,uid:uid }),8).catch(console.log);
        // if(!__DEV__){
        this.showLogConnect(`Result: send thong tin toi Slack==> ${resultRequest?'SUCCESS':'FAIL'}`);
        console.log(TAG,'changeDeviceName sendValidatorKey begin02');
        resultRequest =  await Util.excuteWithTimeout(APIService.requestStake({
          ProductID:product_id,
          ValidatorKey:ValidatorKey,
          qrCodeDeviceId:this.deviceIdFromQrcode,
          PaymentAddress:PaymentAddress
        }),8).catch(console.log);
        this.showLogConnect(`Result: requestStake ==> ${resultRequest?'SUCCESS':'FAIL'}`);
        console.log(TAG,'changeDeviceName sendValidatorKey begin03');
        // }
        // console.log(TAG,'changeDeviceName resultRequest = ',resultRequest);
        // console.log(TAG,'changeDeviceName end result  = ',result);
        const dataRequestStake = resultRequest?.data||{}; // {"PaymentAddress","Commission","StakerAddress"}
        if(!_.isEmpty(dataRequestStake) && !_.isEmpty(dataRequestStake.PaymentAddress)){
          // save to local
          fetchProductInfo.minerInfo = {
            ...fetchProductInfo.minerInfo,
            ...dataRequestStake
          };
          console.log(TAG,'changeDeviceName sendValidatorKey begin04');
          await LocalDatabase.updateDevice(fetchProductInfo);
          console.log(TAG,'changeDeviceName requestStake update = ',fetchProductInfo);
        }
        console.log(TAG,'changeDeviceName end ',result);
        // if(!_.isEmpty(result)){
        //   return result;
        // }
      }
      errMessage = errorMessage;

    } catch (error) {
      console.log(TAG,'changeDeviceName error');
      // __DEV__ && this.showToastMessage(error.message);
      this.showLogConnect(`Result: connected Node ==> FAIL- message ${error.message}`);
      
      throw new Error(errMessage);
    }
    this.showLogConnect('Result: connected Node ==> SUCCESS');
    return true;
  }

  handleSubmit = onClickView(async() => {
    let errMessage = '';
    try {
      this.setState({
        loading: true
      });
      const {addProduct,wallName} = this.state;
      let fetchProductInfo = {};
      if (this.validWallName) {
        fetchProductInfo = await this.updateDeviceNameRequest(addProduct.product_id,wallName);
        const listResult =  await this.saveProductList(fetchProductInfo);
        // console.log(TAG,'handleSubmit saved - listResult = ',listResult);
      }
      if(!_.isEmpty(fetchProductInfo)){
        // create account
        // console.log(TAG,'handleSubmit fetchData = ',fetchProductInfo);
        let result = await this.viewCreateAccount?.current?.createAccount(fetchProductInfo.product_name);
        
        const {PrivateKey = '',AccountName = '',PaymentAddress = '',PublicKeyCheckEncode='',ValidatorKey = ''} = result??{};
        result = await NodeService.sendValidatorKey(Device.getInstance(addProduct),ValidatorKey);

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
  saveProductList = async (deviceInfo) =>{
    try {
      // let listLocalDevice = await LocalDatabase.getListDevices();
      // listLocalDevice.push(deviceInfo);
      // await LocalDatabase.saveListDevices(listLocalDevice);
      await LocalDatabase.updateDevice(deviceInfo);
      // const response = await APIService.getProductList(true);
      // const { status, data } = response;
      // if (status == 1) {
      //   // console.log(TAG,'saveProductList begin data = ',data);
      //   await LocalDatabase.saveListDevices(data);
      //   return data;
      // }
      return true;
    } catch (error) {
      return false;
    }
  }

  render() {
    const { container} = styles;
    const {
      loading
    } = this.state;
    const {isRenderUI,navigation} = this.props;
    
    return (
      <View style={[container,isRenderUI?undefined:styleHideView]}>
        <DeviceConnection ref={this.deviceId} />
        {this.renderDeviceName()}
        {/* <Loader loading={loading} /> */}
        {this.renderWifiPassword()}
        {/* {this.renderToastMessage()} */}

        <View style={styleHideView}>
          <CreateAccount ref={this.viewCreateAccount} navigation={navigation} />
        </View>
      </View>
    );
  }

  validWallName=(text) =>{
    const isValid = !_.isEmpty(text);
    this.setState({
      wallName: text,
      validWallName: isValid
    });
  }
  validSSID=(text)=>{
    const isValid = !_.isEmpty(text);
    this.setState({
      ssid: text,
      validSSID: isValid
    });
  }
  validWPA=(text)=>{
    const isValid = text.length >= 6 ? true : false;
    this.setState({
      wpa: text,
      validWPA: isValid
    });
  }
  sendZMQ = async ()=> {
    const { validSSID, validWPA, ssid, wpa, longitude, latitude,isRenderUI } = this.state;
    if (!isRenderUI || validSSID && validWPA) {
      Keyboard.dismiss();

      this.setState({
        loading: true
      });
      const deviceId = DeviceInfo.getUniqueId();
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
          ssid: `'${ssid}'`,
          wpa: wpa,
          product_name:`${CONSTANT_MINER.PRODUCT_NAME}_${this.deviceIdFromQrcode}`,
          product_type: DEVICES.MINER_TYPE,
          source:  Platform.OS,
          verify_code: verify_code,
          address: 'NewYork',
          address_long: 0.0,
          address_lat: 0.0,
          platform: CONSTANT_MINER.PRODUCT_TYPE,
          // time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          // timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          time_zone: getTimeZone(),
          timezone: getTimeZone(),
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

  tryConnectHomeWifi = async ()=>{
    try {
      const { validSSID, validWPA, ssid, wpa, longitude, latitude,isRenderUI } = this.state;
      await Util.excuteWithTimeout(this.deviceId?.current?.removeConnectionDevice(this.deviceMiner),4).catch(console.log);
      const homeWifi = new ObjConnection();
      homeWifi.id = ssid;
      homeWifi.name = ssid;
      homeWifi.password = wpa;
      await Util.tryAtMost(this.deviceId?.current?.connectAWifi(homeWifi),2,2);
    } catch (error) {
      console.log(error);
    }
    return true;
    
  }

  connectZMQ = async (params) =>{
    try {
      const { validSSID, validWPA, ssid, wpa, longitude, latitude,isRenderUI } = this.state;
      this.isSendDataZmqSuccess = false;
      const res = await ZMQService.sendData(JSON.stringify(params));
      if(_.isEmpty(res)) return false;
      console.log(TAG,'Send zmq successfully res',res);
      await this.tryConnectHomeWifi();
      this.isSendDataZmqSuccess = true;

      const checkConnectWifi = async ()=>{
        const state = await NetInfo.fetch().catch(console.log);
        const {isConnected = false, isInternetReachable = null} = state ??{};
        const isConnectHotspot = await this.checkIsConnectedWithHotspot();
        console.log(TAG, 'connectZMQ checkConnectWifi00 isConnected = ',isConnected,'-isInternetReachable =',isConnectHotspot);
        
        const isConnectedCombined = isConnected &&(!isConnectHotspot || this.isHaveNetwork);
        
        console.log(TAG, 'connectZMQ checkConnectWifi isConnected end ----- ',isConnectedCombined);

        return isConnectedCombined?isConnectedCombined : new Error('is connected fail ');
      };

      // const result = await Util.excuteWithTimeout(checkConnectWifi(),60);
      const result = await Util.tryAtMost(checkConnectWifi,60,2,2).catch(console.log)||false;
      this.showLogConnect(result?'quay ve lai WIFI cu => SUCCESS':'quay ve lai WIFI cu => FAIL');
      console.log(TAG, 'connectZMQ begin end  ',result);
      return result;

    } catch (error) {
      console.log(TAG,'Send zmq error',error);
    }

    return false;

  }


  _handleConnectionChange = async (state) => {
    console.log(TAG,'_handleConnectionChange: begin state =',state);
    const {isInternetReachable = false ,type = '',isConnected = false,details={}  } = state ??{};
    const {ssid = ''  } = details ??{};

    this.isHaveNetwork = isConnected && (isInternetReachable || !(await this.deviceId?.current?.isConnectedWithNodeHotspot()));
    
    console.log(TAG,`_handleConnectionChange: ${this.isHaveNetwork}-ssid=${ssid}`);
    this.setState({
      isConnected: isConnected
    });
  };

  updateDeviceNameRequest = async (product_id,name) => {
    let params = {
      product_id: product_id,
      product_name: name
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
      console.log(TAG,'updateDeviceNameRequest error');
    }
    return null;
  }
  set CurrentPositionStep(index:Number){
    this.setState({
      currentPositionStep:index
    });
  }

  getCurrentConnect = async ()=>{
    let device = await this.deviceId?.current?.getCurrentConnect();
    return device;
  };
  cleanOldDataForSetup = async ()=>{
    const result = await SSHService.run('10.42.0.1','sudo rm -r /home/nuc/aos/inco-data/ && sudo rm -r /home/nuc/aos/inco-eth-kovan-data/ && sudo docker rm -f inc_miner && sudo docker rm -f inc_kovan').catch(console.log);
    console.log(TAG,'cleanOldDataForSetup data = ',result);
    return !_.isEmpty(result) ;
  }

  checkIsConnectedWithHotspot = async ()=>{
    return await this.deviceId?.current?.isConnectedWithNodeHotspot(); 
  }
  
  checkConnectHotspot = async  ()=> {

    const { validSSID, validWPA,isRenderUI } = this.state;
    this.showLogConnect('bat dat check da connect hotspot chua?');
    let isConnectedHotpost = await this.checkIsConnectedWithHotspot();
    this.showLogConnect(isConnectedHotpost?'da connect roi':'chua connect va bat dau connect');
    let device = null;
    this.CurrentPositionStep = 0;
    console.log(TAG,'checkConnectHotspot begin isConnectedHotpost : ', isConnectedHotpost);
    if(!isConnectedHotpost){
      const connectHotspot = this.connectHotspot;
      device = await Util.tryAtMost(connectHotspot,3,1).catch(e=>new ExHandler(new CustomError(knownCode.node_can_not_connect_hotspot)).throw());
      device = device instanceof Error ?null:device;

      this.showLogConnect(device instanceof Error ?'sau khi thu 3 lan connect hotspot va FAIL':'connect HOTSPOT thanh cong');
    }

    if(!device){
      device = await this.deviceId?.current?.getCurrentConnect();
    }
    console.log(TAG,'checkConnectHotspot begin01 : ', device,'-validSSID = ',validSSID,'validWPA = ',validWPA);

    if(Platform.OS === 'ios'){
      this.isHaveNetwork = false;
      isConnectedHotpost = !_.isEmpty(device) ;
    }else{
      this.isHaveNetwork = false;
      isConnectedHotpost = !_.isEmpty(device) ;

      // isConnectedHotpost = !_.isEmpty(device) && !this.isHaveNetwork;
      // this.isHaveNetwork = false;
    }
    const isCheckInputWifiInfo = isRenderUI?validSSID && validWPA:true;
    if (isConnectedHotpost && isCheckInputWifiInfo) {
      let ssid = device?.name?.toLowerCase()||'';
      const product = (HOTPOT??CONSTANT_MINER.PRODUCT_TYPE).toLowerCase();
      console.log(TAG,'checkConnectHotspot SSID---: ', ssid,'=== HOTPOT = ',HOTPOT);
      if (_.includes(ssid, product)) {
        this.CurrentPositionStep = 1;
        console.log(TAG,'checkConnectHotspot OKKKKKK');
        this.showLogConnect('Bat dau send Thong tin toi cho MINER');
        await this.cleanOldDataForSetup();
        let result = await Util.excuteWithTimeout(this.sendZMQ(),400);
        this.showLogConnect(result? 'Send Thong tin MINER thanh cong':'Send Thong tin MINER FAIL---');
        return result;
      }
    }
    
    return false;
  }

  /**
   * func will retried 3 times
   */
  authFirebase = async (productInfo) =>{
    try {
      this.showLogConnect('Bat dau Auth Firebase');
      if(_.isEmpty(productInfo)){
        return {};
      }
      console.log(TAG,' authFirebase begin productInfo = ',productInfo);
      const authFirebaseFunc = ()=> {
        return NodeService.authFirebase(productInfo);
      };
      let authFirebase = await Util.tryAtMost(authFirebaseFunc,3,3);
      this.showLogConnect(authFirebase?'Auth Firebase=> SUCCESS':'Auth Firebase=> FAIL');
      return authFirebase;
    } catch (error) {
      this.showLogConnect('Auth Firebase=> FAIL');
      new ExHandler(new CustomError(knownCode.node_auth_firebase_fail,{rawCode:error})).throw();
    }
  }

  /**
   * @returns:[JSON]: product info
   */
  tryVerifyCode = async()=> {
    
    try {
      this.showLogConnect('Bat dat tryVerifyCode');
      const { verifyCode } = this.state;
      console.log(TAG,' tryVerifyCode begin01 connected = ',this.isHaveNetwork);
    
      const promiseNetwork = ()=>{
        console.log(TAG,' tryVerifyCode begin02 ---- connected = ',this.isHaveNetwork);
        return this.isHaveNetwork ? NodeService.verifyProductCode(verifyCode):Promise(new Error('no internet'));
      };
      const resultStep2  = await Util.tryAtMost(promiseNetwork,TIMES_VERIFY,2);
      this.setState({
        addProduct:resultStep2
      });
      this.showLogConnect(`tryVerifyCode=> ${resultStep2?'SUCCESS':'FAIL'}`);
      return resultStep2;
    } catch (error) {
      console.log(TAG,' tryVerifyCode errrrorr ---- ',error);
      this.showLogConnect('tryVerifyCode=> FAIL');
      new ExHandler(new CustomError(knownCode.node_verify_code_fail)).throw();
    }
    
  }

}


SetupDevice.propTypes = {
  currentConnect: PropTypes.objectOf(PropTypes.object),
  isRenderUI: PropTypes.bool,
  wallet: PropTypes.objectOf(PropTypes.object)
};
SetupDevice.defaultProps = {
  isRenderUI:true
};
const mapDispatch = { };
const mapStateToProps = state => ({
  getAccountByName: getAccountByName(state),
});
export default connect(
  mapStateToProps,
  mapDispatch,
  null,
  {
    forwardRef: true
  }
)(SetupDevice);
