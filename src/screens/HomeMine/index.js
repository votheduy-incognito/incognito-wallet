import Container from '@components/Container';
import BaseScreen from '@screens/BaseScreen';
import images from '@src/assets';
import DialogLoader from '@src/components/DialogLoader';
import HeaderBar from '@src/components/HeaderBar/HeaderBar';
import HomeMineItem from '@src/components/HomeMineItem';
import { CONSTANT_MINER } from '@src/constants';
import Device from '@src/models/device';
import routeNames from '@src/router/routeNames';
import APIService from '@src/services/api/miner/APIService';
import ViewUtil from '@src/utils/ViewUtil';
import LocalDatabase from '@utils/LocalDatabase';
import Util from '@utils/Util';
import _ from 'lodash';
import React from 'react';
import {FlatList, Image, StatusBar, Text, TouchableOpacity, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import {COLORS} from '@src/styles';
import style from './style';

export const TAG = 'HomeMine';


class HomeMine extends BaseScreen {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'My Nodes',
      headerBackground:'transparent',
      headerTitleStyle:style.titleHeader,
      headerRight:  (<TouchableOpacity><Image source={images.ic_add_device} /></TouchableOpacity>)
    };
  }
  constructor(props) {
    super(props);
    const {navigation,wallet}= props;
    this.state = {
      selectedIndex: 0,
      listDevice: [],
      wallet:wallet,
      balancePRV:0,
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
    // StatusBar.setBackgroundColor(COLORS.white);
    // hientesting
    // const {
    //   product_id ='b005ada1-c16f-4dc1-8e95-6c4ff282f66e',
    //   qrcodeDevice='',
    //   ValidatorKey='15oDPbAxPmkULeHLvtPm9af2xDH1Dmumkv8zBdDxZtFAavMMwX5',
    //   PrivateKey='112t8rnp1c9NSK9hbo6dLwY6cjMnBZPZ6MTyVjVg6vN4kX7sxMeScHSQPx59QffSohPVwNHmrLk7eMrpjn7qVBpWXws9Zg4puwWi3UszU3RQ',
    //   PaymentAddress='1Uv2dV2A3ZYwfZ75hAHXLzCQDS5xQ9PiHAfL5cYVVMXmxzW1cKGDUdiVRt5yLcV4UbhvyDps3VpD4rT548sRx4zWeRrbRjHWanphwEoa2'
    // } = {};
    // const s = await APIService.requestStake({
    //   ProductID:product_id,
    //   ValidatorKey:ValidatorKey,
    //   qrCodeDeviceId:qrcodeDevice,
    //   PaymentAddress:PaymentAddress
    // });
    // console.log(TAG,'componentWillMount response = ',s);
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
        // console.log(TAG, 'createSignIn saveUser signIn reponse ',response);
      }
      const { status, data } = response;
      list = (status === 1 && await this.saveData(data)) || [];
      this.setState({
        loading:false,
        listDevice:list
      });
      // console.log(TAG, 'createSignIn saveUser ');
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

  handleLoadMore = () => {};
  handleRefresh = async () => {
    const {isFetching,loading,wallet} = this.state;
    if(!isFetching){
      this.sessionTimer = Date.now();
      // this.balancePRV = 0;
      this.setState({
        isFetching:true,
        isLoadMore:false,
        listDevice:[],
        timeToUpdate:this.sessionTimer
      },async () => {
        // let balance = 0;
        this.balancePRV = 0;
        let list: [] = await this.getListLocalDevice();
        // // list = _.isEmpty(list)?await this.fetchProductList():list.reverse();
        list = list.reverse();
        // for(let item of list){
        //   // const item = list[index];
        //   const temp = await Device.getRewardAmount(Device.getInstance(item),wallet);
        //   balance += temp;
        //   console.log(TAG, 'handleRefresh -------forEach-- balance = ', balance,temp);
        // }

        // let list: [] = await this.fetchProductList();
        // list = _.isEmpty(list)?await this.getListLocalDevice():list.reverse();
        // let list: [];
        // console.log(TAG, 'handleRefresh balance = ', balance);
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
    this.goToScreen(routeNames.GetStaredMineStake);

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
    const options= {
      title: 'My Nodes',
      headerBackground:'transparent',
      headerTitleStyle:style.titleHeader,
      headerRight:  (<TouchableOpacity onPress={()=>{this.goToScreen(routeNames.AddNode);}}><Image source={images.ic_add_device} /></TouchableOpacity>)
    };
    const {navigation} = this.props;
    return (
      <HeaderBar
        index={0}
        navigation={navigation}
        scene={{descriptor:{options}}}
      />
    );
  };
  renderEmptyComponent =()=>{
    const {isFetching} = this.state;
    return (
      !isFetching && (
        <View style={{flex:1,justifyContent:'center',alignItems:'center' }}>
          <Image source={images.ic_no_finding_device} />
        </View>
      )
    );
  }
  renderFirstOpenApp = ()=>{
    // const {listDevice} = this.state;
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
      timeToUpdate,
      balancePRV,
    } = this.state;
    const balanceDisplayPRV = Device.formatForDisplayBalance(balancePRV??0);
    // const viewCustom = this.renderFirstOpenApp();
    // return viewCustom;
    return (!isFetching && _.isEmpty(listDevice)?this.renderFirstOpenApp(): (
      <Container styleContainScreen={style.container}>
        {this.renderHeader()}
        <DialogLoader loading={loading} />
        <Text style={style.header2}>Total earnings</Text>
        <Text style={style.header3}>
          {balanceDisplayPRV} <Text style={style.header3_child}>PRV</Text>
        </Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[{ flexGrow: 1}]}
          style={style.list}
          data={listDevice}
          keyExtractor={item => String(item.product_id)}
          onEndReachedThreshold={0.7}
          ListEmptyComponent={this.renderEmptyComponent()}
          renderItem={({ item,index }) => {
            return (
              <HomeMineItem
                reloadList={()=>{
                  this.onResume();
                }}
                callbackReward={(amount)=>{
                  // const {timeToUpdate} = this.state;
                  if(_.isEqual(this.sessionTimer,timeToUpdate) && _.isNumber(amount)){
                    this.balancePRV += amount;
                    this.setState({
                      balancePRV:this.balancePRV
                    });
                  }
                }}
                timeToUpdate={timeToUpdate}
                onPress={this.handleItemDevicePress}
                isActive
                containerStyle={style.itemList}
                item={item}
              />
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
