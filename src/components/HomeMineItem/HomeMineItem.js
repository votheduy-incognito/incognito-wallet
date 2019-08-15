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
    if(!_.isEqual(item,prevProps?.item)){
      console.log(TAG,'componentDidUpdate begin 010101');
      this.getInfo();
    }
    if(!_.isEqual(prevProps.timeToUpdate,timeToUpdate)){
      console.log(TAG,'componentDidUpdate begin timeToUpdate = ',timeToUpdate);
      this.checkActive();
    }
    
  }
  // componentWillMount(){
  //   this.getInfo();
  //   this.checkActive();
  // }
  async componentDidMount(){
    this.getInfo();
    this.checkActive();
  }
  getInfo = async ()=>{
    const {item,isActive,getAccountByName,wallet} = this.props;
    let {deviceInfo,account,balance} = this.state;
    if(!_.isEmpty(item)){
      account = await getAccountByName(deviceInfo.Name);
      balance = await deviceInfo.balance(account,wallet);
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
      console.log(TAG,'checkActive begin');
      const dataResult = await DeviceService.send(item,LIST_ACTION.CHECK_STATUS).catch(err=>{
        console.log(TAG,'checkActive error');
        this.setDeviceOffline();
      })||{};
      const { status = -1, data={status:Device.offlineStatus()},productId = -1 } = dataResult;
      if(status === 1 && item?.product_id === productId ){
        console.log(TAG,'checkActive begin 010101');
        deviceInfo.data.status = data.status;
        this.setState({
          deviceInfo:deviceInfo
        });
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
    let styleStatus = {color:'#91A4A6'};
    if(deviceInfo.data.status.code === Device.CODE_STOP){
      styleStatus.color = '#91A4A6';
    }else if(deviceInfo.data.status.code === Device.CODE_MINING){
      styleStatus.color = '#0DB8D8';
    }else if(deviceInfo.data.status.code === Device.CODE_SYNCING){
      styleStatus.color = '#262727';
    }
    return [styles.groupRight_title,styleStatus];
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
        <Image style={styles.imageLogo} source={images.ic_device} />
        <View style={styles.groupLeft}>
          <Text style={styles.groupLeft_title}>{deviceInfo.Name}</Text>
          <Text style={styles.groupLeft_title2}>Earned: <Text style={{color:'#000000'}}>{balance}$</Text></Text>
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

