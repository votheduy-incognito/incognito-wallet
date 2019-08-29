import routeNames from '@src/router/routeNames';
import BaseScreen from '@screens/BaseScreen';
import LocalDatabase from '@utils/LocalDatabase';
import React from 'react';
import Container from '@components/Container';
import {  Header, Button, ListItem} from 'react-native-elements';
import { Alert, FlatList, Image,TouchableOpacity ,Text,View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import _ from 'lodash';
import { connect } from 'react-redux';
import Util from '@utils/Util';
import { CONSTANT_MINER } from '@src/constants';
import DialogLoader from '@src/components/DialogLoader';
import images from '@src/assets';
import APIService from '@src/services/api/miner/APIService';
import ViewUtil from '@src/utils/ViewUtil';
import HomeMineItem from '@src/components/HomeMineItem';
import { DEVICES } from '@src/constants/miner';
import style from './style';

export const TAG = 'HomeMine';

class HomeMine extends BaseScreen {
  constructor(props) {
    super(props);
    const {navigation,wallet}= props;
    this.state = {
      selectedIndex: 0,
      listDevice: [],
      wallet:wallet,
      timeToUpdate: Date.now(),
      isFetching: false,
      isLoadMore: false,
      loading: false
    };
  }
  onResume = () => {
    this.handleRefresh();
  };
  async componentWillMount(){
    await this.createSignIn();
  }

  componentDidMount = async () => {
    super.componentDidMount();
    
  };

  componentDidUpdate(prevProps) {
    
  }

  createSignIn = async () => {
    const user = await LocalDatabase.getUserInfo();
    if (_.isEmpty(user)) {
      this.setState({
        loading:true
      });
      let list = [];
      const deviceId = DeviceInfo.getUniqueID();
      const params = {
        email: deviceId + '@minerX.com',
        password: Util.hashCode(deviceId)
      };
      let response = await APIService.signUp(params);
      if (response.status !== 1) {
        response = await APIService.signIn(params);
      }
      const { status, data } = response;
      list = (status === 1 && await this.saveData(data)) || [];
      this.setState({
        loading:false,
        listDevice:list
      });
      console.log(TAG, 'createSignIn saveUser ');
    }
  };

  isProduct = item => {
    const isProduct = _.includes(item.platform, CONSTANT_MINER.PRODUCT_TYPE)&& item.is_checkin == 1;
    // console.log(TAG, 'isProduct end = ', isProduct);
    return isProduct;
  };
  saveData = async (data):Promise<Array<Object>> => {
    let filterProducts = [];
    if (data) {
      const {
        email,
        fullname,
        id,
        token,
        phone,
        user_hash,
        gender,
        credit,
        last_update_task,
        created_at,
        country,
        birth,
        city,
        code,
        products = [],
        refresh_token
      } = data;
      
      // filterProducts = products?.filter(item => this.isProduct(item))||[];
      const user = {
        email: email,
        fullname: fullname,
        id: id,
        token: token,
        refresh_token: refresh_token,
        user_hash: user_hash,
        last_update_task: last_update_task,
        birth: birth,
        city: city,
        code: code,
        country: country,
        created_at: created_at,
        credit: credit,
        gender: gender,
        phone: phone
      };
      //Save to async storage
      await LocalDatabase.saveUserInfo(JSON.stringify(user));
      // if (filterProducts) {
      //   // console.log(TAG, 'saveData filterProducts = ', filterProducts);
      //   await LocalDatabase.saveListDevices(filterProducts);
      // }
    }
    return filterProducts;
  };

  showAlertOffline(message) {
    setTimeout(() => {
      Alert.alert(
        '',
        message,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: true }
      );
    }, 0.5 * 1000);
  }
  handleLoadMore = () => {};
  handleRefresh = async () => {
    const {isFetching,loading} = this.state;
    if(!isFetching){
      
      this.setState({
        isFetching:true,
        timeToUpdate:Date.now()
      },async ()=>{
        let list: [] = await this.getListLocalDevice();
        // list = _.isEmpty(list)?await this.fetchProductList():list.reverse();
        list = list.reverse();
        // let list: [] = await this.fetchProductList();
        // list = _.isEmpty(list)?await this.getListLocalDevice():list.reverse();
        // let list: [];
        console.log(TAG, 'handleRefresh list = ', list);
        this.setState({
          listDevice: list,
          isFetching: false
        });
      });
      
    }
  };
  handleAddVirtualNodePress=()=>{
    this.goToScreen(routeNames.AddSelfNode);
  }
  handleAddNodePress=()=>{
    this.goToScreen(routeNames.AddDevice);
  }
  getListLocalDevice = async () => {
    let listDevice = await LocalDatabase.getListDevices();
    listDevice = listDevice.filter(item=>{
      // console.log('HHHHHH item',item);
      return _.includes(item.platform, CONSTANT_MINER.PRODUCT_TYPE)&& item.is_checkin == 1;//&&  item.product_type === DEVICES.VIRTUAL_TYPE;
    });
    return listDevice;
  };
  handleItemDevicePress=(item)=>{
    this.goToScreen(routeNames.DetailDevice, {
      device: item
    });
  }
  fetchProductList = async () =>{
    console.log(TAG,'callGetProductList');
    this.setState({
      loading: true
    });
    try {
      const response = await APIService.getProductList();
      const { status, data } = response;
      if (status == 1) {
        const products = data.filter(item => this.isProduct(item));
        await LocalDatabase.saveListDevices(products);

        this.setState({
          loading: false
        });
        return products;
      } else {
        const { message } = data;
        if (message) {
          ViewUtil.showAlert(message);
        }
      }
    } catch (error) {
      this.setState({
        loading: false
      });
      return undefined;
    }
  }
  renderHeader = () => {
    return (
      <Header
        containerStyle={style.containerHeader}
        centerComponent={(
          <Text style={style.titleHeader}>
            My Nodes
          </Text>
        )}
        rightComponent={(
          <TouchableOpacity
            onPress={() => {
              this.goToScreen(routeNames.AddNode);
            }}
          >
            <Image source={images.ic_add_device} />
          </TouchableOpacity>
        )}
      />
    );
  };
  renderEmptyComponent =()=>{
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center' }}>
        <Image source={images.ic_no_finding_device} />
      </View>
    );
  }
  renderFirstOpenApp = ()=>{
    const {listDevice} = this.state;
    return (
      <View style={style.container_first_app}>
        <Image resizeMode="cover" source={images.bg_first} style={{ position: 'absolute',width:'100%',height:'100%'}} />
        <View style={style.group_first_open}>
          <Text style={style.group_first_open_text01}>Welcome!</Text>
          <Text style={style.group_first_open_text02}>Add a Node to start</Text>
          <Button
            titleStyle={style.textTitleButton}
            buttonStyle={[style.button,{backgroundColor:'#101111'}]}
            onPress={this.handleAddVirtualNodePress}
            title='Add a Virtual Node'
          />
          <Button
            titleStyle={style.textTitleButton}
            buttonStyle={style.button}
            onPress={this.handleAddNodePress}
            title='Add a Node Device'
          />
        </View>
      </View>
    );
  }
  render() {
    const {
      listDevice,
      isFetching,
      isLoadMore,
      loading,
      timeToUpdate
    } = this.state;
    // const viewCustom = this.renderFirstOpenApp();
    // return viewCustom;
    return (!isFetching && _.isEmpty(listDevice)?this.renderFirstOpenApp(): (
      <Container styleContainScreen={style.container}>
        {this.renderHeader()}
        <Text style={style.header2}>earnings so far</Text>
        <Text style={style.header3}>
          0.00 <Text style={style.header3_child}>PRV</Text>
        </Text>
        <DialogLoader loading={loading} />
        <FlatList
          contentContainerStyle={_.isEmpty(listDevice) ? { flexGrow: 1 }:undefined}
          style={style.list}
          data={listDevice}
          keyExtractor={item => String(item.product_id)}
          onEndReachedThreshold={0.7}
          ListEmptyComponent={this.renderEmptyComponent()}
          renderItem={({ item,index }) => {
            return (
              <HomeMineItem timeToUpdate={index === 0?timeToUpdate:0} onPress={this.handleItemDevicePress} isActive containerStyle={style.itemList} item={item} />
            );
          }}
          onRefresh={this.handleRefresh}
          refreshing={isFetching && !isLoadMore}
          onEndReached={this.handleLoadMore}
        />
        
      </Container>
    ));
  }
}

HomeMine.propTypes = {};

HomeMine.defaultProps = {};
export default connect(
  state => ({
    wallet:state.wallet,
  }),
  dispatch => ({
  })
)(HomeMine);
