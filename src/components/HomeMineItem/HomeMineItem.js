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
      deviceInfo : Device.getInstance(item)
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if(!_.isEqual(nextProps.item,prevState.item)){
      return {
        item:nextProps?.item,
        deviceInfo:Device.getInstance(nextProps?.item)
      };
    }
    return null;
  }
  
  async componentDidMount(){
    const {item,isActive,getAccountByName,wallet} = this.props;
    let {deviceInfo} = this.state;
    const account = await getAccountByName(deviceInfo.Name);
    const balance = await deviceInfo.balance(account,wallet);

    if(isActive){
      DeviceService.send(item,LIST_ACTION.CHECK_STATUS).then(dataResult=>{
        const { status = -1, data={status:Device.offlineStatus()}, message= 'Offline',productId = -1 } = dataResult;
        // console.log(TAG,'componentDidMount send dataResult = ',dataResult);
        if(item.product_id === productId ){
          deviceInfo.data.status ={
            code:data.status.code,
            message:data.status.message
          };
          this.setState({
            account:account,
            balance:balance,
            deviceInfo:deviceInfo
          });
        }
      // ViewUtil.showAlert(JSON.stringify(data));
      }).catch(err=>{
        this.setDeviceOffline();
      });
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
};

HomeMineItem.propTypes = {
  item: PropTypes.object.isRequired,
  getAccountByName:PropTypes.func.isRequired,
  wallet:PropTypes.object.isRequired,
  containerStyle:PropTypes.object,
  isActive:PropTypes.bool,
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

