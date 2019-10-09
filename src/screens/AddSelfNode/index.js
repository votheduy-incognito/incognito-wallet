/**
 * @providesModule SetupWifiDevice
 */
import Loader from '@components/DialogLoader';
import routeNames from '@routers/routeNames';
import BaseScreen from '@screens/BaseScreen';
import {CONSTANT_MINER} from '@src/constants';
import {DEVICES} from '@src/constants/miner';
import {onClickView} from '@src/utils/ViewUtil';
import LocalDatabase from '@utils/LocalDatabase';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, Text} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Button, Input} from 'react-native-elements';
import Dialog, {DialogContent, DialogTitle} from 'react-native-popup-dialog';
import StepIndicator from 'react-native-step-indicator';
import styles, {placeHolderColor} from './style';
import {CustomError, ErrorCode, ExHandler} from '@src/services/exception';

const SHORT_DOMAIN_REGEX = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
const FULL_DOMAIN_REGEX = /^(http)|(https):\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
const IP_ADDRESS_REGEX = /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+(:[0-9]+)?$/;
const LOCALHOST_REGEX = /^localhost(:[0-9]+)?$/;

export const TAG = 'AddSelfNode';

const errorMessage = 'Something went wrong. Let\'s start again.';

const labels = ['Connect Hotpot','Send Wifi Info','Verify Code'];

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
    this.inputHost = '';
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
          errorMessage={_.isEmpty(this.inputHost)?'Required':''}
          labelStyle={label}
          onChangeText={(text) =>this.inputHost = text}
          underlineColorAndroid="transparent"
          inputStyle={textInput}
          inputContainerStyle={item_container_input}
          containerStyle={[item]}
          placeholder="192.168.1.1 or node.example.com"
          label='IP address or domain'
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
  };

  async validateHost(host) {
    if (host === 'localhost' || SHORT_DOMAIN_REGEX.test(host) || FULL_DOMAIN_REGEX.test(host) || IP_ADDRESS_REGEX.test(host)) {
      let isValid = true;
      if (IP_ADDRESS_REGEX.test(host)) {
        const parts = _.split(host, ':');
        const ip = parts[0];
        const ipParts = _.split(ip, '.');
        isValid = ipParts.every(item => {
          const number = _.toNumber(item);
          return number <= 255;
        });
      }

      console.log('isValid', isValid);

      if (isValid) {
        return isValid;
      }
    }

    throw new CustomError(ErrorCode.node_invalid_host);
  }

  async parseHost(host) {
    let port;
    let address;

    if (FULL_DOMAIN_REGEX.test(host) || SHORT_DOMAIN_REGEX.test(host)) {
      address = host;
      port = '';
    } else if (IP_ADDRESS_REGEX.test(host) || LOCALHOST_REGEX.test(host)) {
      const listLocalDevice = await LocalDatabase.getListDevices();
      const parts =  _.split(host,':')||[];
      address = _.trim(parts[0]);
      port = parts.length > 1 ?_.trim(parts[parts.length-1]):this.inputPort;
      port = !_.isEmpty(port) && _.isNumber(Number(port))?port:this.inputPort;
      const duplicatedNode = listLocalDevice.find(({ minerInfo }) => minerInfo.ipAddress === host && minerInfo.port === port);

      if (duplicatedNode) {
        throw new CustomError(ErrorCode.node_duplicate);
      }
    }

    console.log(TAG,'parseHost', address, port);

    const userJson = await LocalDatabase.getUserInfo();
    const user = userJson.toJSON();
    const {
      email,
      id,
      created_at,
    } = user;
    const deviceName = _.isEmpty(port) ? address : `${address}:${port}`;

    console.log('DeviceName', deviceName, address, port);

    const time = Date.now().toString();
    const account = {};
    return {
      minerInfo: {
        account: account,
        ipAddress: address,
        port: port
      },
      product_name: deviceName,
      created_from: Platform.OS,
      address: 'NewYork',
      address_long: 0.0,
      address_lat: 0.0,
      platform: CONSTANT_MINER.PRODUCT_TYPE,
      product_type: DEVICES.VIRTUAL_TYPE,
      timezone: DeviceInfo.getTimezone(),
      user_id: id,
      email: email,
      id: id,
      product_id: `${DEVICES.VIRTUAL_TYPE}-${time}`,
      created_at: created_at,
      deleted: false,
      is_checkin: 1,
    };
  }

  handleSetUpPress = onClickView(async ()=>{
    try {
      const userJson = await LocalDatabase.getUserInfo();
      const host = _.trim(this.inputHost).toLowerCase();

      // let privateKey = selectedAccount?.PrivateKey||'';
      // privateKey = _.trim(_.isEmpty(privateKey)?this.inputPrivateKey:privateKey);
      if (userJson && !_.isEmpty(host)) {
        await this.validateHost(host);
        const listLocalDevice = await LocalDatabase.getListDevices();
        // const isImportPrivateKey = _.isEmpty(selectedAccount?.PrivateKey);
        const deviceJSON = await this.parseHost(host);
        listLocalDevice.push(deviceJSON);
        await LocalDatabase.saveListDevices(listLocalDevice);
        this.goToScreen(routeNames.HomeMine);
        return true;
        // const resultAccount =( isImportPrivateKey && await this.viewImportPrivateKey.current.importAccount({accountName:deviceJSON.product_name,privateKey:privateKey})) ||false;
        // if(resultAccount || !isImportPrivateKey){
        //   let listLocalDevice = await LocalDatabase.getListDevices();
        //   listLocalDevice.push(deviceJSON);
        
        //   await LocalDatabase.saveListDevices(listLocalDevice);
        //   // create account if import private key

        //   this.goToScreen(routeNames.HomeMine);
        //   return;
        // }
      }
    } catch (errorMessage) {
      new ExHandler(errorMessage).showErrorToast();
      return errorMessage;
    }
  });

  render() {
    const { container, textInput, item,item_container_input ,label } = styles;
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

// export default connect(
//   state => ({
//     wallet: state.wallet,
//     defaultAccountName: accountSeleclor.defaultAccount(state)?.name,
//     accountList: accountSeleclor.listAccount(state),
//   }),
//   mapDispatch
// )(AddSelfNode);

const AddSelfNodeComponent = AddSelfNode;

export default AddSelfNodeComponent;
