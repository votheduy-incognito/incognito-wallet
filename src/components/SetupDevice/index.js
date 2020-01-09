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
const TIMES_VERIFY = 90;

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
    console.log(TAG,'connectHotspot BEGIN ------- ');
    const funcName = `${this.deviceIdFromQrcode}-connectHotspot`;
    const errorObj = new Error('connectHotspot fail');
    try {
      this.logOnView(`${TAG} Begin: connect HOTSPOT-----`);

      let WifiName = this.getHotspotName();
      WifiName = _.isEmpty(WifiName)?(await this.fetchHotspotInfo())?.name:WifiName;
      await APIService.trackLog({action:funcName, message:`Connect HOTSPOT = ${WifiName}`});
      
      if(!_.isEmpty(WifiName)){
        this.logOnView(`${TAG} Begin: connect HOTSPOT WifiName=${WifiName}`);
        const result = await this.deviceId?.current?.connectDevice(this.deviceMiner,true);

        this.logOnView(TAG+' END: connect HOTSPOT WifiName = '+WifiName + '-------result = '+result);
        // await APIService.trackLog({action:funcName, message:`connectHotspot ${result?'SUCCESS':'FAIL va retry'} HOTSPOT = ${WifiName}`});
        console.log(TAG,'connectHotspot end result = ',result);
        return result?this.deviceMiner:errorObj;
      }else{
        this.logOnView(`${TAG} - connectHotspot wifi is empty`);
        return errorObj;
      }
    } catch (error) {
      await APIService.trackLog({action:funcName, message:`Connect HOTSPOT error_catch = ${error?.message||''}`});
      if(error instanceof CustomError){
        this.logOnView(`${TAG} - connectHotspot error hotspot = ${this.deviceIdFromQrcode}`);
        console.log(TAG,`connectHotspot error hotspot = ${this.deviceIdFromQrcode}`);
        // new ExHandler(error).throw();
        
      }
      console.log(TAG,'connectHotspot error '+error?.message);
      return error;
    }

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
      const hotspotConnection = await this.fetchHotspotInfo();
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
      this.logOnView(`${TAG} - handleSetUpPress error hotspot = ${error?.message??''}`);
      console.log(TAG,'handleSetUpPress error: ', error);
      errorMsg = error.message??errorMessage;
      if(error instanceof CustomError){
        console.log(TAG,'handleSetUpPress error01');
        new ExHandler(error).throw();
      }
    }finally{
      !_.isNil(this.deviceMiner) && await this.deviceId?.current?.removeConnectionDevice(this.deviceMiner);
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
    const funcName = `${this.deviceIdFromQrcode}-changeDeviceName`;
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
        await APIService.trackLog({action:funcName, message:`Bat dau send account cho Node - check account = ${!_.isEmpty(accountModel)}`});
        let result = !_.isEmpty(accountModel) ?accountModel: await this.createAccount(fetchProductInfo.product_name);
        const {PrivateKey = '',AccountName = '',PaymentAddress = '',PublicKeyCheckEncode='',ValidatorKey = ''} = result;
        console.log(TAG,'changeDeviceName sendValidatorKey begin');
        this.logOnView(`Begin: sendValidatorKey-ValidatorKey = ${ValidatorKey}`);
        await APIService.trackLog({action:funcName, message:`Bat dau send ValidatorKey = ${ValidatorKey}`});
        result = await NodeService.sendValidatorKey(Device.getInstance(addProduct),ValidatorKey);

        await APIService.trackLog({action:funcName, message:`Result: sendValidatorKey==> ${result?'SUCCESS':'FAIL'}`});
        this.logOnView(`Result: sendValidatorKey==> ${result?'SUCCESS':'FAIL'}`);

        const uid = result?.uid||'';
        console.log(TAG,'changeDeviceName sendValidatorKey begin01');
        // firebase_uid

        let resultRequest =  await Util.excuteWithTimeout(APIService.sendInfoStakeToSlack({productId:product_id,qrcodeDevice:this.deviceIdFromQrcode,miningKey:ValidatorKey,publicKey:PublicKeyCheckEncode,sendValidatorKey:result,paymentAddress:PaymentAddress,uid:uid }),8).catch(console.log);
        // if(!__DEV__){

        await APIService.trackLog({action:funcName, message:`Result: send Slack==> ${resultRequest?'SUCCESS':'FAIL'}`});
        this.logOnView(`Result: send Slack==> ${resultRequest?'SUCCESS':'FAIL'}`);


        console.log(TAG,'changeDeviceName sendValidatorKey begin02');
        resultRequest =  await Util.excuteWithTimeout(APIService.requestStake({
          ProductID:product_id,
          ValidatorKey:ValidatorKey,
          qrCodeDeviceId:this.deviceIdFromQrcode,
          PaymentAddress:PaymentAddress
        }),8).catch(console.log);

        await APIService.trackLog({action:funcName, message:`Result: requestStake ==> ${resultRequest?'SUCCESS':'FAIL'}`});
        this.logOnView(`Result: requestStake ==> ${resultRequest?'SUCCESS':'FAIL'}`);

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
      await APIService.trackLog({action:funcName, message:`Result: connected Node ==> ERROR- message ${error.message}`});
      this.logOnView(`Result: connected Node ==> FAIL- message ${error.message}`);

      throw new Error(errMessage);
    }
    await APIService.trackLog({action:funcName, message:'Result: connected Node ==> SUCCESS'});
    this.logOnView('Result: connected Node ==> SUCCESS');
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
          this.goToScreen(routeNames.Node);
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
      const funcName = `${this.deviceIdFromQrcode}-sendZMQ`;
      this.setState({
        loading: true
      });
      this.logOnView(`sendZMQ wifi ${ssid}-pass = ${wpa} `);
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
          wpa: `'${wpa}'`,
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
        // console.log(TAG, 'Params:', JSON.stringify(params));
        
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
    const { validSSID, validWPA, ssid, wpa, longitude, latitude,isRenderUI } = this.state;
    try {
      this.logOnView(`tryConnectHomeWifi BEGIN remove ssid = ${this.deviceMiner?.name??''}`);
      await this.deviceId?.current?.removeConnectionDevice(this.deviceMiner);
      await Util.delay(3);
      let homeWifi = new ObjConnection();
      homeWifi.id = ssid,
      homeWifi.name = ssid;
      homeWifi.password = wpa;
      this.logOnView(`tryConnectHomeWifi BEGIN connect ssid = ${ssid}-pass=${wpa}`);
      await this.deviceId?.current?.connectAWifi(homeWifi);
    } catch (error) {
      this.logOnView(`tryConnectHomeWifi ERROR ssid = ${ssid} = ${error?.message||''}`);
      console.log(TAG,'tryConnectHomeWifi error - ',error);
      return false;
    }
    return true;

  }

  connectZMQ = async (params) =>{
    try {
      const funcName = `${this.deviceIdFromQrcode}-connectZMQ`;
      // const { validSSID, validWPA, ssid, wpa, longitude, latitude,isRenderUI } = this.state;
      this.isSendDataZmqSuccess = false;
      const sendZMQ = async ()=> {
        this.logOnView('connectZMQ sendZMQ ----- begin ');
        const result = await NodeService.sendZMQ(params);
        return _.isEmpty( result) ? new CustomError(knownCode.node_can_not_connect_hotspot):result;
      };
      let res = await Util.tryAtMost(sendZMQ,3,3);
      this.logOnView('connectZMQ sendZMQ ----- begin ');
      
      if(_.isEmpty(res)) return false;

      this.logOnView('Send zmq successfully & tryConnectHomeWifi');
      console.log(TAG,'Send zmq successfully res',res);
      await this.tryConnectHomeWifi();
      this.logOnView('tryConnectHomeWifi thanh cong');
      this.isSendDataZmqSuccess = true;

      // const checkConnectWifi = async ()=>{
      //   const state = await NetInfo.fetch().catch(console.log);
      //   const {isConnected = false, isInternetReachable = null} = state ??{};
      //   const isConnectHotspot = await this.checkIsConnectedWithHotspot();
      //   console.log(TAG, 'connectZMQ checkConnectWifi00 isConnected = ',isConnected,'-isInternetReachable =',isConnectHotspot);

      //   const isConnectedCombined = isConnected &&(!isConnectHotspot || this.isHaveNetwork);

      //   console.log(TAG, 'connectZMQ checkConnectWifi isConnected end ----- ',isConnectedCombined);

      //   return isConnectedCombined?isConnectedCombined : new Error('is connected fail ');
      // };

      // const result = await Util.tryAtMost(checkConnectWifi,60,2,2).catch(console.log)||false;

      const result = await Util.delay(5)??true;

      await APIService.trackLog({action:funcName,rawData:`data = ${JSON.stringify(params)}`, message:'quay ve lai WIFI cu => SUCCESS sau khi send data'});

      this.logOnView(result?'quay ve lai WIFI cu => SUCCESS':'quay ve lai WIFI cu => FAIL');
      console.log(TAG, 'connectZMQ begin end  ',result);
      return result;

    } catch (error) {
      this.logOnView(`Send zmq ERRROR = ${error?.message||''}`);
      console.log(TAG,'Send zmq error',error);
    }

    return false;

  }


  _handleConnectionChange = async (state) => {
    console.log(TAG,'_handleConnectionChange: begin state =',state);
    const {isInternetReachable = false ,type = '',isConnected = false,details={}  } = state ??{};
    const {ssid = ''  } = details ??{};

    this.isHaveNetwork = isConnected && (isInternetReachable || !(await this.checkIsConnectedWithHotspot()));

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

  fetchHotspotInfo = async ()=>{
    const qrCode = this.deviceIdFromQrcode;
    const funcName = `${qrCode}-getHotspotName`;
    let hotspotName = this.deviceMiner?.name ||'';
    try {
      if(_.isEmpty(hotspotName)&& !_.isEmpty(qrCode)){
        await APIService.trackLog({action:funcName, message:`call service qrCodeCheckGetWifi - qrcode = ${qrCode}`});
        // call api to get wifi's name
        const response = await Util.excuteWithTimeout(APIService.qrCodeCheckGetWifi({QRCode:qrCode}),5).catch(console.log);
        let {WifiName = '', Status= false} = response?.data ??{};
        this.logOnView(TAG + ' get hotspot server WifiName = ' + WifiName);
        this.deviceMiner = new ObjConnection();
        if(_.isEmpty(WifiName)){
          let suffix = _.split(qrCode,'-')[1];
          suffix = !_.isEmpty(suffix) && _.size(suffix) == 6 ?`-${suffix}`:'';
  
          WifiName = `${HOTPOT}${suffix}`;
          WifiName = `${HOTPOT}${suffix}`;
        }else{
  
          let name = _.split(WifiName,'-')[0];
          HOTPOT = name;
        }
        hotspotName = WifiName;
        this.deviceMiner.name = WifiName;
        this.deviceMiner.id = WifiName;
       
      }
    } catch (error) {
      this.logOnView(`${TAG}-${funcName} : catch error =${error?.message}`);
      await APIService.trackLog({action:funcName, message:`catch error qrcode = ${qrCode}`,rawData:`error message=${error?.message}`});
    }
    
    return this.deviceMiner;
  };

  getHotspotName = ()=>{
    let hotspotName = this.deviceMiner?.name ||'';
    return hotspotName;
  };

  checkIsConnectedWithHotspot = async ()=>{
    return await this.deviceId?.current?.isConnectedWithNodeHotspot();
  }

  doubleCheckIsConnectedWithHotspot = async ()=>{
    let result = await this.checkIsConnectedWithHotspot();
    if(_.isNil(result)){
      result = await SSHService.testConnect();
      this.logOnView('doubleCheckIsConnectedWithHotspot testConnect result = '+ _.toString(result));
    }
    return result;
  }

  checkConnectHotspot = async  ()=> {
    const funcName = `${this.deviceIdFromQrcode}-checkConnectHotspot`;
    const { validSSID, validWPA,isRenderUI } = this.state;
    this.logOnView('bat dau check da connect hotspot chua?');

    let isConnectedHotpost = await this.doubleCheckIsConnectedWithHotspot();
    await APIService.trackLog({action:funcName, message:isConnectedHotpost?'Da connect HOTSPOT':'Chua connect HOTSPOT'});
    this.logOnView(isConnectedHotpost?'da connect roi':'chua connect va bat dau connect');

    ///
    // test
    // !isConnectedHotpost ? new ExHandler(new CustomError(knownCode.node_can_not_connect_hotspot)).showWarningToast().throw():true;
    ///
    ///////////////
    let objConnection = null;
    this.CurrentPositionStep = 0;
    if(!isConnectedHotpost){
      // const connectHotspot = this.connectHotspot;
      objConnection = await Util.tryAtMost(this.connectHotspot,3,1).catch(e=>new ExHandler(new CustomError(knownCode.node_can_not_connect_hotspot)).throw());
      objConnection = objConnection instanceof ObjConnection ?objConnection : null;

      this.logOnView(objConnection ?`${TAG} checkConnectHotspot connect HOTSPOT - name = ${objConnection.name||''} thanh cong`:'sau khi thu 3 lan connect hotspot va FAIL');
    }
    isConnectedHotpost = await this.doubleCheckIsConnectedWithHotspot();
    if(!isConnectedHotpost){
      !_.isNil(this.deviceMiner) && await this.deviceId?.current?.removeConnectionDevice(this.deviceMiner);
      new ExHandler(new CustomError(knownCode.node_can_not_connect_hotspot)).throw();
    }
    
    
    
    if(!objConnection){
      objConnection = isConnectedHotpost ? this.deviceMiner:null;
      // objConnection = await this.deviceId?.current?.getCurrentConnect();
      this.logOnView('connect HOTSPOT - objConnection is Null and init 1 '+ objConnection);
      // await APIService.trackLog({action:funcName, message:`getCurrentConnect obj is null=>${_.isEmpty(objConnection)}`});
      // objConnection = _.isNil(objConnection)?this.deviceMiner:objConnection;
      // await APIService.trackLog({action:funcName, message:`deviceMiner obj is null=>${_.isEmpty(this.deviceMiner)}`});
      // this.logOnView('connect HOTSPOT - objConnection is Null and init 2 '+ objConnection);
    }
    let ssid = objConnection?.name;
    // console.log(TAG,'checkConnectHotspot begin01 : ', objConnection,'-validSSID = ',validSSID,'validWPA = ',validWPA);
    await APIService.trackLog({action:funcName, message:`Connect HOTSPOT-${_.isEmpty(ssid)?'FAILED':`PASSED-ssid=${ssid}`}`});
    this.isHaveNetwork = false;
    // isConnectedHotpost = !_.isEmpty(objConnection) ;
    const isCheckInputWifiInfo = isRenderUI?validSSID && validWPA:true;
    if (isConnectedHotpost && isCheckInputWifiInfo) {
      ssid = objConnection?.name?.toLowerCase()||'';
      const product = (HOTPOT??CONSTANT_MINER.PRODUCT_TYPE).toLowerCase();
      console.log(TAG,'checkConnectHotspot SSID---: ', ssid,'=== HOTPOT = ',HOTPOT);
      if (_.includes(ssid, product)) {
        this.CurrentPositionStep = 1;
        console.log(TAG,'checkConnectHotspot OKKKKKK');

        this.logOnView('Bat dau cleanOldDataForSetup MINER = '+ objConnection.name);
        await APIService.trackLog({action:funcName, message:'Send thong tin cho Node'});

        await NodeService.cleanOldDataForSetup();
        this.logOnView('Bat dau send Thong tin toi cho MINER');
        let result = await Util.excuteWithTimeout(this.sendZMQ(),450);

        await APIService.trackLog({action:funcName, message:result? 'Send Thong tin Node PASSED':'Send Thong tin Node FAIL'});
        this.logOnView(result? 'Send Thong tin MINER thanh cong':'Send Thong tin MINER FAIL---');
        return result;
      }
    }

    return false;
  }

  /**
   * func will retried 3 times
   */
  authFirebase = async (productInfo) =>{
    const funcName = `${this.deviceIdFromQrcode}-authFirebase`;
    try {

      await APIService.trackLog({action:funcName, message:'Bat dau Auth Firebase',rawData:`productInfo = ${JSON.stringify(productInfo)}`});
      this.logOnView('Bat dau Auth Firebase');
      if(_.isEmpty(productInfo)){
        return {};
      }

      const authFirebaseFunc = async ()=> {
        console.log(TAG,' authFirebase retry ----- begin ');
        const resultFbUID = await NodeService.authFirebase(productInfo).catch(e=>console.log(TAG,' authFirebase catch error = ',e)) ?? '';
        console.log(TAG,' authFirebase retry ----- end result =',resultFbUID);
        return _.isEmpty( resultFbUID) ? new CustomError(knownCode.node_auth_firebase_fail):resultFbUID;
      };
      let authFirebase = await Util.tryAtMost(authFirebaseFunc,3,3);

      await APIService.trackLog({action:funcName, message:authFirebase?'Auth Firebase=> SUCCESS':'Auth Firebase=> FAIL'});
      this.logOnView(authFirebase?'Auth Firebase=> SUCCESS':'Auth Firebase=> FAIL');

      return authFirebase;
    } catch (error) {
      await APIService.trackLog({action:funcName, message:'Auth Firebase=> ERROR',rawData:`error message = ${error?.message||''}`});
      this.logOnView('Auth Firebase=> FAIL');
      new ExHandler(new CustomError(knownCode.node_auth_firebase_fail,{rawCode:error})).throw();
    }
  }

  /**
   * @returns:[JSON]: product info
   */
  tryVerifyCode = async()=> {
    const funcName = `${this.deviceIdFromQrcode}-tryVerifyCode`;
    const { verifyCode } = this.state;
    try {
      
      await APIService.trackLog({action:funcName, message:`Bat dat tryVerifyCode - ${verifyCode}`});
      this.logOnView('Bat dat tryVerifyCode');

      
      console.log(TAG,' tryVerifyCode begin01 connected = ',this.isHaveNetwork);

      const promiseNetwork = async ()=>{
        console.log(TAG,' tryVerifyCode begin02 ---- connected = ',this.isHaveNetwork);
        const result = await NodeService.verifyProductCode(verifyCode).catch(console.log)??false;
        return result? result : new Error('no internet');
      };
      const resultStep2  = await Util.tryAtMost(promiseNetwork,TIMES_VERIFY,2);
      this.setState({
        addProduct:resultStep2
      });

      await APIService.trackLog({action:funcName, message:`tryVerifyCode => ${resultStep2?'SUCCESS':'FAIL'}`});
      this.logOnView(`tryVerifyCode=> ${resultStep2?'SUCCESS':'FAIL'}`);

      return resultStep2;
    } catch (error) {
      console.log(TAG,' tryVerifyCode errrrorr ---- ',error);
      await APIService.trackLog({action:funcName,message:`code = ${verifyCode}`, rawData:`tryVerifyCode => ERROR = ${error?.message}`});
      this.logOnView('tryVerifyCode=> FAIL');
      new ExHandler(new CustomError(knownCode.node_verify_code_fail)).showWarningToast().throw();
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
