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

import styles, { placeHolderColor } from './style';

export const TAG = 'AddSelfNode';

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
class AddSelfNode extends BaseScreen {
  
  constructor(props) {
    super(props);
    const {accountList = [],defaultAccountName= ''} = props;
      
    this.state = { 
      currentPositionStep:0,
      accountList:[],
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
          placeholder="Private key or choose account."
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
      const host = this.inputHost;
      
      let privateKey = selectedAccount?.PrivateKey||'';
      privateKey = _.trim(_.isEmpty(privateKey)?this.inputPrivateKey:privateKey);
      console.log(TAG,'handleSetUpPress host = ',host+'- inputPrivateKey = '+privateKey);
      const port = this.inputPort;
      if (userJson && !_.isEmpty(host) && !_.isEmpty(port) && !_.isEmpty(privateKey) ) {
        const isImportPrivateKey = !_.isEmpty(this.inputPrivateKey);
        const user = userJson.toJSON();
        const {
          email,
          id,          
          created_at,
          
        } = user;
        let deviceName = this.inputDeviceName;
        deviceName = _.isEmpty(deviceName)?`${host}:${port}`:deviceName;
        deviceName = deviceName || CONSTANT_MINER.VIRTUAL_PRODUCT_NAME;
        const time = Date.now().toString();
        const account = {
          name:_.isEmpty(selectedAccount)?deviceName:(selectedAccount?.name||'')
        };
        const deviceJSON =  {
          minerInfo:{
            account:account,
            ipAddress:host,
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
        const resultAccount =( isImportPrivateKey && await this.viewImportPrivateKey.current.importAccount({accountName:deviceJSON.product_name,privateKey:privateKey})) ||false;
        if(resultAccount || !isImportPrivateKey){
          let listLocalDevice = await LocalDatabase.getListDevices();
          listLocalDevice.push(deviceJSON);
        
          await LocalDatabase.saveListDevices(listLocalDevice);
          // create account if import private key

          this.goToScreen(routeNames.HomeMine);
          return;
        }else{
          // this.setState({
          //   loading:false
          // },()=>{
          //   alert('Please check and input correct fields!');
          // });
        }
      // save local
      // 
      }else{
        // this.Loading = false;
        alert('Please check and input correct fields!');
      }
    } catch (error) {
      errorMsg = errorMessage; 
      alert(error.message);
      console.log(TAG,'handleSetUpPress error: ', error);
    }
  });

  render() {
    const { container, textInput, item,item_container_input } = styles;
    const {loading} = this.state;
    return (
      <ScrollView
        keyboardShouldPersistTaps="handled"
      >
        <Loader loading={loading} />
        <KeyboardAvoidingView contentContainerStyle={{flex:1}} keyboardVerticalOffset={50} behavior="padding" style={[container]}>
          {this.renderWifiPassword()}
          {this.renderListAccount()}
          <TextInput
            placeholderTextColor={placeHolderColor}
            underlineColorAndroid="transparent"
            style={[textInput, item,item_container_input]}
            maxLength={200}
            placeholder="Node’s name (optional)"
            onChangeText={(text) =>this.inputDeviceName = text}
          />
          {this.renderToastMessage()}
          <Button
            titleStyle={styles.textTitleButton}
            buttonStyle={styles.button}
            onPress={this.handleSetUpPress}
            title='Add'
          />
          
        </KeyboardAvoidingView>
        <View style={{width: 0,height: 0,position:'absolute',opacity:0}}>
          <ImportAccount ref={this.viewImportPrivateKey} />
        </View>
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
