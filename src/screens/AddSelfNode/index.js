/**
 * @providesModule SetupWifiDevice
 */
import routeNames from '@routers/routeNames';
import LocalDatabase from '@utils/LocalDatabase';
import { CONSTANT_MINER } from '@src/constants';
import Loader from '@components/DialogLoader';
import _ from 'lodash';
import React from 'react';
import {
  Text,
  TextInput,
  View,
  Platform,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { connect } from 'react-redux';
import BaseScreen from '@screens/BaseScreen';
import { Button,Input } from 'react-native-elements';
import { onClickView } from '@src/utils/ViewUtil';
import PropTypes from 'prop-types';
import StepIndicator from 'react-native-step-indicator';
import { accountSeleclor } from '@src/redux/selectors';
import Dialog, { DialogContent,DialogTitle } from 'react-native-popup-dialog';
import DeviceInfo from 'react-native-device-info';
import { DEVICES } from '@src/constants/miner';
import ImportAccount from '@screens/ImportAccount';
import { Toast } from '@src/components/core';

import styles, { placeHolderColor } from './style';

export const TAG = 'AddSelfNode';

const errorMessage = 'Can\'t connect The Miner. Please check the internert information and try again';

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
class AddSelfNode extends BaseScreen {
  
  constructor(props) {
    super(props);
    const {accountList = [],defaultAccountName= ''} = props;
      
    this.state = { 
      currentPositionStep:0,
      accountList:accountList,
      loading:false,
      defaultAccountName:defaultAccountName,
      selectedAccount:undefined,
      isConnected: false,
      isShowListAccount:false
    };
   
    this.viewImportPrivateKey = React.createRef();
    // this.viewInnputDeviceName = React.createRef();
    // this.viewInputHost = React.createRef();
    // this.viewInputPort = React.createRef();
    this.inputDeviceName = '';
    this.inputPrivateKey = '';
    this.inputHost = '192.168.1.1';
    this.inputPort = '9334';
  }

  componentDidMount(){
    super.componentDidMount();
  }
  componentWillUnmount() {
    super.componentWillUnmount();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if(!_.isEqual(nextProps?.accountList,prevState.accountList)){
      const {accountList = [],defaultAccountName= ''} = nextProps;
      
      // const selectedAccount = _.isEmpty(prevState.selectedAccount) ? accountList.filter((value,index)=>{
      //   return value.name === defaultAccountName;
      // }):prevState.selectedAccount;
      return {
        accountList:nextProps?.accountList||[]
      };
    }
    return null;
  }

  handleChooseItemAccount=(item,index)=>{
    this.inputPrivateKey = _.isEmpty(item?.PrivateKey)? this.inputPrivateKey:this.inputPrivateKey;
    this.setState({selectedAccount:item,isShowListAccount:false});
    // this.setState({selectedAccount:index === 0?undefined:item,isShowListAccount:false});
  }
  
  renderWifiPassword=()=>{
    const {  textInput, item, errorText,item_container_input,label } = styles;
    const {
      errorMessage,
      showModal,
      currentPositionStep,
      isDoingSetUp,
    } = this.state;
    if(showModal){
      return null;
    }
    
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
        <>
          <Input
            placeholderTextColor={placeHolderColor}
            maxLength={100}
            labelStyle={label}
            onChangeText={(text) =>this.inputHost = text}
            underlineColorAndroid="transparent"
            inputStyle={textInput}
            inputContainerStyle={item_container_input}
            containerStyle={[item]}
            placeholder="Host"
            label='Host'
            defaultValue={this.inputHost}
          />
          <Input
            labelStyle={label}
            placeholderTextColor={placeHolderColor}
            onChangeText={(text) =>this.inputPort = text}
            underlineColorAndroid="transparent"
            inputStyle={textInput}
            inputContainerStyle={item_container_input}
            containerStyle={[item]}
            keyboardType='numeric'
            maxLength={6}
            label='Port'
            defaultValue={this.inputPort}
            placeholder="Port"
          />
          
          {!_.isEmpty(errorMessage) ? (
            <Text style={[errorText]}>*{errorMessage}</Text>
          ) : null}
          
        </>
      )
    );
  }

  renderInput=()=>{
    const {  textInput, item,item_container_input,label } = styles;
    const {
      errorMessage,
      showModal,
      currentPositionStep,
      isDoingSetUp,
    } = this.state;
    
    return (
      <>
        <Input
          placeholderTextColor={placeHolderColor}
          maxLength={200}
          labelStyle={label}
          onChangeText={(text) =>this.inputHost = text}
          underlineColorAndroid="transparent"
          inputStyle={textInput}
          inputContainerStyle={item_container_input}
          containerStyle={[item]}
          placeholder="Host"
          label='Host'
          defaultValue={this.inputHost}
        />
      </>
    );
  }

  renderListAccount =()=>{
    const {accountList = [],isShowListAccount = false,selectedAccount = {} } = this.state;
    // const accountListCombined = [{name:'Import Private Key'},...accountList];
    const accountListCombined = accountList;
    const isEditatle = _.isEmpty(selectedAccount?.PrivateKey);
    // console.log(TAG,'renderListAccount = item  = ',selectedAccount);
    const textAction = isEditatle ? 'Choose Account':'Import Private Key';
    
    return (
      <>
        <Input
          labelStyle={styles.label}
          placeholder="Enter private key or import from account"
          placeholderTextColor={placeHolderColor}
          underlineColorAndroid="transparent" 
          editable={isEditatle}
          inputStyle={styles.textInput}
          containerStyle={[styles.item]}
          defaultValue={selectedAccount?.PrivateKey||undefined}
          inputContainerStyle={[styles.item_container_input]}
          label='Private Key'
          onChangeText={(text) =>this.inputPrivateKey = text}
        />
        <Text
          style={[styles.buttonChooseAccount]}
          onPress={() => {
            if(isEditatle){
              this.setState({ isShowListAccount: true });
            }else{
              this.setState({ selectedAccount:null });
            }
            
          }}
        >{textAction}
        </Text>
        <Dialog
          width={0.75}
          height={0.5}
          visible={isShowListAccount}
          dialogTitle={<DialogTitle textStyle={styles.item_account_text} title="Choose account" />}
          onTouchOutside={() => {
            this.setState({ isShowListAccount: false });
          }}
        >
          <DialogContent style={styles.dialog_content}>
            {accountListCombined.map((item,index)=>{
              return (<Text key={item.name} style={[styles.item_account_text]} onPress={()=>this.handleChooseItemAccount(item,index)}>{item.name}</Text>);
            })}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  handleSetUpPress = onClickView(async ()=>{
    let errorMsg = '';
    try {
      
      const {selectedAccount} = this.state;
      const userJson = await LocalDatabase.getUserInfo();
      const host = _.trim(this.inputHost);
      
      // let privateKey = selectedAccount?.PrivateKey||'';
      // privateKey = _.trim(_.isEmpty(privateKey)?this.inputPrivateKey:privateKey);
      console.log(TAG,'handleSetUpPress host = ',host);
      
      if (userJson && !_.isEmpty(host)) {
        const arrHost =  _.split(host,':')||[];
        const ipAddress = _.trim(arrHost[0]);
        let port = arrHost.length > 1 ?_.trim(arrHost[arrHost.length-1]):this.inputPort;
        
        port =  !_.isEmpty(port) && _.isNumber(Number(port))?port:this.inputPort;
        console.log(TAG,'handleSetUpPress port = ',port,ipAddress);
        // const isImportPrivateKey = _.isEmpty(selectedAccount?.PrivateKey);
        const user = userJson.toJSON();
        const {
          email,
          id,          
          created_at,
        } = user;
        // let deviceName = host;
        // deviceName = _.isEmpty(deviceName)?`${host}`:deviceName;
        let deviceName = ipAddress || CONSTANT_MINER.VIRTUAL_PRODUCT_NAME;
        const time = Date.now().toString();
        const account = {
        };
        const deviceJSON =  {
          minerInfo:{
            account:account,
            ipAddress:ipAddress,
            port:port
          },
          product_name:deviceName ,
          created_from: Platform.OS,
          address: 'NewYork',
          address_long: 0.0,
          address_lat: 0.0,
          platform: CONSTANT_MINER.PRODUCT_TYPE,
          product_type:DEVICES.VIRTUAL_TYPE,
          timezone: DeviceInfo.getTimezone(),
          user_id: id,
          email: email,
          id: id,
          product_id:`${DEVICES.VIRTUAL_TYPE}-${time}`,
          created_at: created_at,
          deleted: false,
          is_checkin: 1,
        };
        let listLocalDevice = await LocalDatabase.getListDevices();
        listLocalDevice.push(deviceJSON);
        await LocalDatabase.saveListDevices(listLocalDevice);
        this.goToScreen(routeNames.HomeMine);
        return;
        // const resultAccount =( isImportPrivateKey && await this.viewImportPrivateKey.current.importAccount({accountName:deviceJSON.product_name,privateKey:privateKey})) ||false;
        // if(resultAccount || !isImportPrivateKey){
        //   let listLocalDevice = await LocalDatabase.getListDevices();
        //   listLocalDevice.push(deviceJSON);
        
        //   await LocalDatabase.saveListDevices(listLocalDevice);
        //   // create account if import private key

        //   this.goToScreen(routeNames.HomeMine);
        //   return;
        // }
      // save local
      // 
      }else{
        // this.Loading = false;
        Toast.showError('Please check and input correct fields!');
      }
    } catch (error) {
      errorMsg = errorMessage; 
      Toast.showError(error.message);
      console.log(TAG,'handleSetUpPress error: ', error);
    }
  });

  render() {
    const { container, textInput, item,item_container_input ,label} = styles;
    const {loading} = this.state;
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
      >
        <Loader loading={loading} />
        <KeyboardAvoidingView contentContainerStyle={{flex:1}} keyboardVerticalOffset={50} behavior="padding" style={[container]}>
          {this.renderInput()}
          {/* {this.renderWifiPassword()} */}
          {/* {this.renderListAccount()} */}
          {/* <Input
            labelStyle={label}
            placeholderTextColor={placeHolderColor}
            underlineColorAndroid="transparent"
            inputStyle={textInput}
            inputContainerStyle={item_container_input}
            containerStyle={[item]}
            label='Name'
            maxLength={200}
            placeholder="Name of Node (optional)"
            onChangeText={(text) =>this.inputDeviceName = text}
          /> */}
          <Button
            titleStyle={styles.textTitleButton}
            buttonStyle={styles.button}
            onPress={this.handleSetUpPress}
            title='Add'
          />
          
        </KeyboardAvoidingView>
        {/* <View style={{width: 0,height: 0,position:'absolute',opacity:0}}>
          <ImportAccount ref={this.viewImportPrivateKey} />
        </View> */}
      </ScrollView>
    );
  }
  set CurrentPositionStep(index:Number){
    this.setState({
      currentPositionStep:index
    });
  }
  
}

AddSelfNode.propTypes = {
  wallet: PropTypes.objectOf(PropTypes.object),
  accountList: PropTypes.arrayOf(PropTypes.object),
  defaultAccountName:PropTypes.string
};
AddSelfNode.defaultProps = {
  accountList:[],
  defaultAccountName:''
};
const mapDispatch = { };

export default connect(
  state => ({
    wallet: state.wallet,
    defaultAccountName: accountSeleclor.defaultAccount(state)?.name,
    accountList: accountSeleclor.listAccount(state),
  }),
  mapDispatch
)(AddSelfNode);
