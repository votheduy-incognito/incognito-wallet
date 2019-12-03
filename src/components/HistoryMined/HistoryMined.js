import { Text } from '@components/core';
import withdrawNode from '@src/assets/images/icons/withdraw-node.png';
import tokenData from '@src/constants/tokenData';
import Device from '@src/models/device';
import NodeService, { LIST_ACTION } from '@src/services/NodeService';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { DEVICES } from '@src/constants/miner';
import CryptoIcon from '../CryptoIcon';
import styles from './style';

const TAG = 'HistoryMined';
class HistoryMined extends React.Component {
  constructor(props){
    super(props);
    const {listItems} = props;
    this.state = {
      listItems:listItems,
      // deviceInfo : Device.getInstance(),
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

  // componentDidMount(){
  //   const {item,isActive} = this.props;
  //   let {deviceInfo} = this.state;
  // if(isActive && deviceInfo && deviceInfo.ProductId == DEVICES.MINER_TYPE ){
  //   NodeService.send(item,LIST_ACTION.CHECK_STATUS).then(dataResult=>{
  //     const { status = -1, data, message= 'Offline',productId = -1 } = dataResult;
  //     if(item.product_id === productId ){
  //       deviceInfo.data.status ={
  //         code:status,
  //         message:message
  //       };
  //       this.setState({
  //         deviceInfo:deviceInfo
  //       });
  //     }
  //   // ViewUtil.showAlert(JSON.stringify(data));
  //   }).catch(err=>{
  //     this.setDeviceOffline();
  //   });
  // }else{
  //   this.setDeviceOffline();
  // }
  // }
  // setDeviceOffline =()=>{
  //   let {deviceInfo} = this.state;
  //   deviceInfo.Status = Device.offlineStatus();
  //   this.setState({
  //     deviceInfo:deviceInfo,
  //   });
  // };

  renderItem=({ item,index })=> {
    const {onPress,listItems,onPressWithdraw} = this.props;
    const {name = '',symbol = '',amount = 0,pSymbol='', id = '',tokenId} = item;
    const isPRV = _.isEqual(symbol,'PRV');
    const symbolUI = isPRV?symbol:pSymbol;
    console.log(TAG,`renderItem index = ${index} --- item=${JSON.stringify(item)}`);
    // const nameUI = isPRV?name:`Private ${symbol}`;
    const nameUI = isPRV?name:`${symbol}`;
    const {icon = null} = this.getData(item)??{};
    // const imgSrc = isPRV ? withdrawNodeDisabled : withdrawNode;
    const imgSrc =  withdrawNode;
    return (
      <TouchableOpacity
        style={[styles.container_item, index === listItems.length - 1 ? styles.last_item : {}]}
        onPress={()=>{
          onPress? onPress(item):undefined;
        }}
      >
        {!_.isEmpty(icon)?<Image style={styles.imageLogo} source={icon} />:<CryptoIcon tokenId={tokenId} />}
        {/* <CryptoIcon tokenId={tokenId} /> */}
        <View style={styles.groupLeft}>
          <Text style={styles.groupLeft_title}>{nameUI}</Text>
          <Text style={styles.groupRight_title}>{`${amount} ${symbolUI}`}</Text>
        </View>
        <TouchableOpacity style={styles.groupRight} onPress={()=>onPressWithdraw&&onPressWithdraw(item)}>
          <Image source={imgSrc} resizeMode="contain" resizeMethod="resize" style={styles.withdraw_logo} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  getData = (token) => {
    const additionData = tokenData.DATA[token?.tokenId] || tokenData.parse(token);
    const { metaData, othertokenData } = token;
    const data = {
      ...additionData,
      ...metaData,
      ...othertokenData
    };
    // console.log(TAG,'getData begin ==== ',additionData,symbolUI);
    // console.log(TAG,'getData end ==== ',data);
    return data;
  };

  render() {
    const {
      listItems,
      isFetching,
      isLoadMore
    } = this.state;
    const {containerStyle} = this.props;

    return (
      <View style={[styles.container,containerStyle]}>
        <FlatList
          style={styles.list}
          data={listItems}
          ListEmptyComponent={<Text style={styles.text_empty}>You haven{'\''}t started earning yet.</Text>}
          keyExtractor={(item,index)=> `${item.tokenId}_${index}`}
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
  onPress:(item)=>{},
  onPressWithdraw:undefined
};

HistoryMined.propTypes = {
  containerStyle:PropTypes.object,
  isActive:PropTypes.bool,
  listItems:PropTypes.array,
  onPress:PropTypes.func,
  onPressWithdraw:PropTypes.func,
};

export default HistoryMined;
