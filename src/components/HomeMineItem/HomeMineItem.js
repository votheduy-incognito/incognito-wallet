import PropTypes from 'prop-types';
import React  from 'react';
import { View, Text,Image,TouchableOpacity } from 'react-native';
import images from '@src/assets';
import _ from 'lodash';
import ViewUtil from '@src/utils/ViewUtil';
import DeviceService, { LIST_ACTION } from '@src/services/DeviceService';
import Device from '@src/models/device';
import { accountSeleclor } from '@src/redux/selectors';
import { connect } from 'react-redux';
import { DEVICES } from '@src/constants/miner';
import VirtualDeviceService from '@src/services/VirtualDeviceService';
import convert from '@src/utils/convert';
import common from '@src/constants/common';
import styles from './style';

const TAG = 'HomeMineItem';
class HomeMineItem extends React.Component {
  constructor(props){
    super(props);
    const {item,wallet} = props;
    this.state = {
      item:item,
      account:{},
      balance:0,
      timeToUpdate:0,
      deviceInfo : Device.getInstance(item)
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if(!_.isEqual(nextProps.item,prevState.item)){
      console.log(TAG,'getDerivedStateFromProps begin 010101');
      return {
        item:nextProps?.item,
        deviceInfo:Device.getInstance(nextProps?.item)
      };
    }
    
    return null;
  }

  componentDidUpdate(prevProps,prevState){
    const {item,timeToUpdate} = this.props;
    let isUpdateInfo = false;
    if(!_.isEqual(item,prevProps?.item)){
      console.log(TAG,'componentDidUpdate begin 010101');
      this.getInfo();
      isUpdateInfo = true;
    }
    if(!_.isEqual(prevProps.timeToUpdate,timeToUpdate)){
      console.log(TAG,'componentDidUpdate begin timeToUpdate = ',timeToUpdate);
      isUpdateInfo =  !isUpdateInfo && this.getInfo();
      this.checkActive();
    }
    
  }
  
  async componentDidMount(){
    this.getInfo();
    this.checkActive();
  }
  getInfo = async ()=>{
    const {item,isActive,getAccountByName,wallet} = this.props;
    let {deviceInfo,account,balance} = this.state;
    if(!_.isEmpty(item)){
      switch(deviceInfo.Type){
      case DEVICES.VIRTUAL_TYPE:{
        let dataResult = await VirtualDeviceService.getRewardAmount(deviceInfo) ?? {};
        console.log(TAG,'fetchData VIRTUAL_TYPE ',dataResult);
        const {Result={}} = dataResult;
        balance = convert.toHumanAmount(Result['PRV'],common.DECIMALS['PRV']);
        balance = _.isNaN(balance)?0:balance;
        break;
      }
      default:{
        account = await getAccountByName(deviceInfo.accountName());
        balance = await deviceInfo.balance(account,wallet);
      }
      }
      
    }
    this.setState({
      account:account,
      balance:balance
    });
  }
  checkActive = async ()=>{
    const {item,isActive} = this.props;
    let {deviceInfo} = this.state;
    
    if(isActive){
      console.log(TAG,'checkActive begin deviceType = ',deviceInfo.Type);
      let dataResult = {};
      switch(deviceInfo.Type){
      case DEVICES.VIRTUAL_TYPE:{
        // dataResult = await VirtualDeviceService.getMininginfo(deviceInfo).catch(err=>{
        //   console.log(TAG,'checkActive error VIRTUAL_TYPE');
        //   this.setDeviceOffline();
        // })||{};
        // const shardId = dataResult.Result?.ShardID ?? undefined;
        // console.log(TAG,'checkActive shardID ',shardId);
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
    switch(deviceInfo.Type){
    case DEVICES.VIRTUAL_TYPE:{
      return images.ic_virtual_device;
    }
    default:
      return images.ic_device;
    }
  }
  render() {
    const {item,deviceInfo,balance} = this.state;
    const {containerStyle,onPress} = this.props;
    
    const styleStatus = this.getStyleStatus();
    return (
      <TouchableOpacity
        style={[styles.container,containerStyle]}
        onPress={()=>{
          onPress(item);
        }}
      >
        <Image style={styles.imageLogo} source={this.getIconWithType()} />
        <View style={styles.groupLeft}>
          <Text style={styles.groupLeft_title}>{deviceInfo.Name}</Text>
          <Text style={styles.groupLeft_title2}>{balance} PRV</Text>
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
  timeToUpdate:0
};

HomeMineItem.propTypes = {
  item: PropTypes.object.isRequired,
  getAccountByName:PropTypes.func.isRequired,
  wallet:PropTypes.object.isRequired,
  containerStyle:PropTypes.object,
  isActive:PropTypes.bool,
  timeToUpdate:PropTypes.number,
  onPress:PropTypes.func
};
const mapDispatch = { };

export default connect(
  state => ({
    wallet:state.wallet,
    getAccountByName: accountSeleclor.getAccountByName(state),
  }),
  mapDispatch
)(HomeMineItem);

