import PropTypes from 'prop-types';
import React  from 'react';
import { View, Text,Image,TouchableOpacity,FlatList } from 'react-native';
import images from '@src/assets';
import routeNames from '@src/router/routeNames';
import ViewUtil from '@src/utils/ViewUtil';
import DeviceService, { LIST_ACTION } from '@src/services/DeviceService';
import Device from '@src/models/device';
import _ from 'lodash';
import tokenData from '@src/constants/tokenData';
import Util from '@src/utils/Util';
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
  static getDerivedStateFromProps(nextProps, prevState) {
    if(!_.isEqual(nextProps.listItems,prevState.listItems)){
      return {
        listItems:nextProps.listItems
      };
    }
    return null;
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
    deviceInfo.Status =Device.offlineStatus();
    this.setState({
      deviceInfo:deviceInfo,
    });
  }
  
  renderItem=({ item,index })=> {
    const {onPress} = this.props;
    const {name = '',symbol = '',amount = 0,pSymbol=''} = item;
    const symbolUI = _.isEqual(symbol,'PRV')?symbol:pSymbol;
    const nameUI = _.isEqual(symbol,'PRV')?name:`Private ${symbol}`;
    const {icon = images.ic_device} = this.getData(item)??{};
    return (
      <TouchableOpacity
        style={styles.container_item}
        onPress={()=>{
          onPress? onPress(item):undefined;
        }}
      >
        <Image style={styles.imageLogo} source={icon} />
        <View style={styles.groupLeft}>
          <Text style={styles.groupLeft_title}>{nameUI}</Text>
          <Text style={styles.groupRight_title}>{`${amount} ${symbolUI}`}</Text>
        </View>
        <View style={styles.groupRight}>
          <Text style={styles.groupRight_title2}>earned</Text>
        </View>
      </TouchableOpacity>
    );
  }
  getData = (token) => {
    const symbolUI = _.isEqual(token?.symbol,'PRV')?token.symbol:token.pSymbol;
    const additionData = tokenData.DATA[symbolUI] ?? tokenData.parse(token);
    const { metaData, othertokenData } = token;
    const data = {
      ...additionData,
      ...metaData,
      ...othertokenData
    };
    return data;
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
          keyExtractor={(item,index)=> `${item.id}_${index}`}
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
  containerStyle:PropTypes.object,
  isActive:PropTypes.bool,
  listItems:PropTypes.array,
  onPress:PropTypes.func
};

export default HistoryMined;
