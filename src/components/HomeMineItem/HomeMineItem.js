import images from '@src/assets';
import { DEVICES } from '@src/constants/miner';
import Device from '@src/models/device';
import { accountSeleclor } from '@src/redux/selectors';
import DeviceService, { LIST_ACTION } from '@src/services/DeviceService';
import VirtualDeviceService from '@src/services/VirtualDeviceService';
import LocalDatabase from '@src/utils/LocalDatabase';
import ViewUtil from '@src/utils/ViewUtil';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { Alert } from '../core';
import styles from './style';

const TAG = 'HomeMineItem';
const descriptionNodeOffline = 'Balance will reload soon\nwhen Node is back online.';
const descriptionMasterNodeOffline = 'Chain under maintenance.\nBalance will reload soon.';
const desciptionMasterAndNodeOffline = 'Balance will reload when Master node is back online.';
class HomeMineItem extends React.Component {
  constructor(props){
    super(props);
    const {item,wallet} = props;
    this.state = {
      item:item,
      account:{},
      balance:null,
      timeToUpdate:0,
      deviceInfo : Device.getInstance(item)
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if(!_.isEqual(nextProps.timeToUpdate,prevState.timeToUpdate)){
      console.log(TAG,'getDerivedStateFromProps begin 010101');
      return {
        item:nextProps?.item,
        balance:null,
        timeToUpdate:nextProps?.timeToUpdate,
        deviceInfo:Device.getInstance(nextProps?.item)
      };
    }

    // if(!_.isEqual(nextProps.timeToUpdate,prevState.timeToUpdate)){
    //   return {
    //     timeToUpdate:nextProps.timeToUpdate
    //   };
    // }
    
    return null;
  }

  async componentDidUpdate(prevProps,prevState){
    const {item,timeToUpdate} = this.props;
    
    // if(!_.isEqual(item,prevProps?.item)){
    //   console.log(TAG,'componentDidUpdate begin 010101');
    //   this.getInfo();
    //   isUpdateInfo = true;
    // }
    if(!_.isEqual(prevProps.timeToUpdate,timeToUpdate) || !_.isEqual(item,prevProps?.item)){
      console.log(TAG,'componentDidUpdate begin timeToUpdate = ',timeToUpdate);
      await this.getInfo();
      
      this.checkActive();
    }
    
  }
  
  async componentDidMount(){
    await this.getInfo();
    this.checkActive();
  }
  getInfo = async ()=>{
    const {getAccountByName,wallet,callbackReward} = this.props;
    let {deviceInfo,account,balance} = this.state;
    
    account = await getAccountByName(deviceInfo.accountName());
    balance = await Device.getRewardAmount(deviceInfo,wallet);
    console.log(TAG,'getInfo name,balance = ',deviceInfo.Name,balance);
    // should be is null or number;
    balance = _.isNaN(balance)?null:balance;
    // balance = 1000000000;
    callbackReward(balance);
    if(_.isNumber(balance) && balance >=0 ){
      balance = Device.formatForDisplayBalance(balance);
    }
    
    console.log(TAG,'getInfo balance format = ',balance);
    this.setState({
      account:account,
      balance:balance
    });
  }

  isFullNodeDie = ()=>{
    const {balance } = this.state;
    return balance ==-1;
  }
  checkActive = async ()=>{
    const {item} = this.props;
    let {deviceInfo} = this.state;
    const isActive = true;
    
    if(isActive){
      console.log(TAG,'checkActive begin deviceType = ',deviceInfo.Type);
      let dataResult = {};
      switch(deviceInfo.Type){
      case DEVICES.VIRTUAL_TYPE:{
        dataResult = await VirtualDeviceService.getChainMiningStatus(deviceInfo) ?? {};
        console.log(TAG,'checkActive VIRTUAL_TYPE ',dataResult);
        break;
      }
      default:{
        dataResult = await DeviceService.send(item,LIST_ACTION.CHECK_STATUS).catch(err=>{
          console.log(TAG,'checkActive error');
          this.setDeviceOffline();
        })||{};
      }
      }
      // console.log(TAG,'checkActive begin 010101');
      const { status = -1, data={status:Device.offlineStatus()},productId = -1 } = dataResult;
      if(_.isEqual(status,1) && item?.product_id === productId ){
        // console.log(TAG,'checkActive begin 020202');
        deviceInfo.Status = data.status;
        this.setState({
          deviceInfo:deviceInfo
        });
      }else{
        this.setDeviceOffline();
      }
      
      
    }else{
      this.setDeviceOffline();
    }
  }
  setDeviceOffline =()=>{
    let {deviceInfo} = this.state;
    deviceInfo.data.status = Device.offlineStatus();
    this.setState({
      deviceInfo:deviceInfo,
    });
  }
  getStyleStatus = ()=>{
    const {deviceInfo} = this.state;
    const styleStatus = Device.getStyleStatus(deviceInfo.Status.code);
    return [styles.groupRight_title,styleStatus];
  }
  getIconWithType = ()=>{
    const {deviceInfo} = this.state;
    const isOffline = deviceInfo.isOffline();
    switch(deviceInfo.Type){
    case DEVICES.VIRTUAL_TYPE:{
      return  isOffline?images.ic_virtual_node_offline:images.ic_virtual_device;
    }
    default:
      return  isOffline?images.ic_node_offline:images.ic_device;
    }
  }
  render() {
    const {item,deviceInfo,balance} = this.state;
    const {containerStyle,onPress} = this.props;
    
    const styleStatus = this.getStyleStatus();
    let textErrorDevice ='';
    if(deviceInfo.isWaiting()){
      textErrorDevice = '---';
    }else{
      if(deviceInfo.isReady()){
        textErrorDevice = 'Tap to start';
      }else if(_.isNil(balance) && deviceInfo.isOffline()){
        textErrorDevice = descriptionNodeOffline;
      }else if(balance == -1){
        textErrorDevice = descriptionMasterNodeOffline;
      }
    }
    return (
      <TouchableOpacity
        style={[styles.container,containerStyle]}
        onLongPress={()=>{
          Alert.alert('Confirm','Are you sure to delete this item?',[{text:'Yes',onPress:async ()=>{
            let list = await LocalDatabase.getListDevices();
            _.remove(list,item);
            await LocalDatabase.saveListDevices(list);
            const {reloadList} = this.props;

            reloadList();
          }},{ text: 'Cancel'}],{cancelable: true});
        }}
        onPress={()=>{
          onPress(item);
        }}
      >
        <Image style={styles.imageLogo} source={this.getIconWithType()} />
        <View style={styles.groupLeft}>
          <Text style={styles.groupLeft_title}>{deviceInfo.Name}</Text>
          {_.isEmpty(textErrorDevice) && !_.isNil(balance)&&<Text style={styles.groupLeft_title2}>{`${balance} PRV`}</Text>}
          {!_.isEmpty(textErrorDevice) &&<Text style={styles.groupLeft_title2}>{textErrorDevice}</Text>}
          
        </View>
        <View style={styles.groupRight}>
          <Text style={styleStatus}>{deviceInfo.statusMessage()}</Text>
          {deviceInfo.data.status.code === Device.CODE_UNKNOWN && ViewUtil.loadingComponent()}
        </View>
      </TouchableOpacity>
    );
  }
}

HomeMineItem.defaultProps = {
  containerStyle:null,
  isActive:false,
  onPress:(item)=>{},
  timeToUpdate:0,
  reloadList:()=>{},
  callbackReward:(amount:Number)=>{}
};

HomeMineItem.propTypes = {
  item: PropTypes.object.isRequired,
  getAccountByName:PropTypes.func.isRequired,
  wallet:PropTypes.object.isRequired,
  containerStyle:PropTypes.object,
  isActive:PropTypes.bool,
  timeToUpdate:PropTypes.number,
  onPress:PropTypes.func,
  reloadList:PropTypes.func,
  callbackReward:PropTypes.func,
};
const mapDispatch = { };

export default connect(
  state => ({
    wallet:state.wallet,
    getAccountByName: accountSeleclor.getAccountByName(state),
  }),
  mapDispatch
)(HomeMineItem);

