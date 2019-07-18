import PropTypes from 'prop-types';
import React  from 'react';
import { View, Text,Image,TouchableOpacity } from 'react-native';
import images from '@src/assets';
import routeNames from '@src/router/routeNames';
import ViewUtil from '@src/utils/ViewUtil';
import DeviceService, { LIST_ACTION } from '@src/services/DeviceService';
import Device from '@src/models/device';
import styles from './style';


const TAG = 'HomeMineItem';
class HomeMineItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      item:props.item,
      deviceInfo : Device.getInstance()
    };
  }
  componentDidMount(){
    const {item,isActive} = this.props;
    let {deviceInfo} = this.state;
    if(isActive){
      DeviceService.send(item,LIST_ACTION.CHECK_STATUS).then(dataResult=>{
        const { status = -1, data, message= 'Offline',productId = -1 } = dataResult;
        // console.log(TAG,'componentDidMount send dataResult = ',dataResult);
        if(item.product_id === productId ){
          deviceInfo.data.status ={
            code:status,
            message:message
          };
          this.setState({
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
    deviceInfo.data.status ={
      code:Device.CODE_OFFLINE,
      message:'Offline'
    };
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
    const {item,deviceInfo} = this.state;
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
          <Text style={styles.groupLeft_title}>{item.product_name}</Text>
          <Text style={styles.groupLeft_title2}>Last: <Text style={{color:'#000000'}}>{item.product_name}</Text></Text>
        </View>
        <View style={styles.groupRight}>
          <Text style={styleStatus}>{deviceInfo.data?.status?.message}</Text>
          {deviceInfo.data.status.code === Device.CODE_UNKNOWN && ViewUtil.loadingComponent()}
        </View>
      </TouchableOpacity>
    );
  }
}

HomeMineItem.defaultProps = {
  containerStyle:{},
  isActive:false,
  onPress:(item)=>{}
};

HomeMineItem.propTypes = {
  item: PropTypes.instanceOf(JSON).isRequired,
  containerStyle:PropTypes.instanceOf(JSON),
  isActive:PropTypes.bool,
  onPress:PropTypes.func
};

export default HomeMineItem;
