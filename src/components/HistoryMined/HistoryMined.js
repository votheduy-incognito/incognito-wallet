import PropTypes from 'prop-types';
import React  from 'react';
import { View, Text,Image,TouchableOpacity,FlatList } from 'react-native';
import images from '@src/assets';
import routeNames from '@src/router/routeNames';
import ViewUtil from '@src/utils/ViewUtil';
import DeviceService, { LIST_ACTION } from '@src/services/DeviceService';
import Device from '@src/models/device';
import _ from 'lodash';
import styles from './style';


const TAG = 'HistoryMined';
class HistoryMined extends React.Component {
  constructor(props){
    super(props);
    const {listItems} = props;
    this.state = {
      listItems:listItems,
      deviceInfo : Device.getInstance(),
      isFetching:false,
      isLoadMore:false,
      loading:false
    };
  }
  componentDidMount(){
    const {item,isActive} = this.props;
    let {deviceInfo} = this.state;
    if(isActive){
      DeviceService.send(item,LIST_ACTION.CHECK_STATUS).then(dataResult=>{
        const { status = -1, data, message= 'Offline',productId = -1 } = dataResult;
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
  
  renderItem=({ item,index })=> {
    const {onPress} = this.props;
    
    return (
      <TouchableOpacity
        style={styles.container_item}
        onPress={()=>{
          onPress(item);
        }}
      >
        <Image style={styles.imageLogo} source={images.ic_device} />
        <View style={styles.groupLeft}>
          <Text style={styles.groupLeft_title}>Incognito</Text>
        </View>
        <View style={styles.groupRight}>
          <Text style={styles.groupRight_title}>0.002I <Text style={styles.groupRight_title2}>mined</Text></Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      listItems,
      isFetching,
      isLoadMore,
      loading
    } = this.state;
    const {containerStyle,onPress} = this.props;
    
    return (
      <View style={[styles.container,containerStyle]}>
        <FlatList
          style={styles.list}
          data={listItems}
          keyExtractor={item => String(item.id)}
          onEndReachedThreshold={0.7}
          renderItem={this.renderItem}
          refreshing={isFetching && !isLoadMore}
          onEndReached={this.handleLoadMore}
        />
      </View>
    );
  }
}

HistoryMined.defaultProps = {
  containerStyle:{},
  isActive:false,
  listItems:[],
  onPress:(item)=>{}
};

HistoryMined.propTypes = {
  item: PropTypes.instanceOf(JSON).isRequired,
  containerStyle:PropTypes.instanceOf(JSON),
  isActive:PropTypes.bool,
  listItems:PropTypes.array,
  onPress:PropTypes.func
};

export default HistoryMined;
