import routeNames from '@src/router/routeNames';
import BaseScreen from '@screens/BaseScreen';
import LocalDatabase from '@utils/LocalDatabase';
import FirebaseService, {
  DEVICE_CHANNEL_FORMAT,
  FIREBASE_PASS,
  MAIL_UID_FORMAT,
  PHONE_CHANNEL_FORMAT
} from '@services/FirebaseService';
import Action from '@models/Action';
import React from 'react';
import Container from '@components/Container';
import {  Header, Icon, ListItem} from 'react-native-elements';
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
import style from './style';

export const TAG = 'HomeMine';

class HomeMine extends BaseScreen {
  constructor(props) {
    super(props);
    
    this.state = {
      selectedIndex: 0,
      listDevice: [],
      isFetching: false,
      isLoadMore: false,
      loading: false
    };
  }
  onResume = () => {
    // console.log(
    //   TAG,
    //   'componentWillFocus begin = ',
    //   Util.hashCode(DeviceInfo.getUniqueID())
    // );
    this.handleRefresh();
  };

  componentDidMount = async () => {
    super.componentDidMount();
    await this.createSignIn();
  };

  createSignIn = async () => {
    const user = await LocalDatabase.getUserInfo();
    if (_.isEmpty(user)) {
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
      if (status === 1) {
        await this.saveData(data);
        this.setState({
          loading: false
        });
      }
    }
    console.log(TAG, 'createSignIn end = ', user);
  };

  isProduct = item => {
    // return item.platform == Constants.PRODUCT_TYPE && item.is_checkin == 1;
    const isProduct = _.includes(item.platform, CONSTANT_MINER.PRODUCT_TYPE)&& item.is_checkin == 1;
    console.log(TAG, 'isProduct end = ', isProduct);
    return isProduct;
  };
  saveData = async data => {
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
        products,
        refresh_token
      } = data;
      let filterProducts = null;
      if (products) {
        filterProducts = products.filter(item => this.isProduct(item));
      }
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
      if (filterProducts) {
        console.log(TAG, 'saveData filterProducts = ', filterProducts);
        await LocalDatabase.saveListDevices(filterProducts);

        // TODO SET ACTIVE DEVICE
        // if (filterProducts.length > 0) {
        //   const first = filterProducts[0];
        //   const autonomousContext = AutonomousContext.getShareManager();
        //   autonomousContext.setActiveDevice(first);
        //   this.props.changeProduct(first.product_id);
        // }
      }
    }
  };

  pingDevice = async product => {
    //const productId = 'a7bec080-154c-4ebc-8a7c-5b8c47fbb9b5'
    let productId = product.product_id;
    console.log('ProductId: ', product.product_id);
    if (productId) {
      this.setState({
        loading: true
      });
      const firebase = FirebaseService.getShareManager();
      let mailProductId = `${productId}${MAIL_UID_FORMAT}`;
      let password = `${FIREBASE_PASS}`;
      console.log('Password: ', password);
      let phoneChannel = `${productId}${PHONE_CHANNEL_FORMAT}`;
      let deviceChannel = `${productId}${DEVICE_CHANNEL_FORMAT}`;
      const action = new Action(
        'incognito',
        phoneChannel,
        { action: 'start', chain: 'incognito', type: '', privateKey: '' },
        'firebase',
        deviceChannel
      );
      // const action = new Action(
      //   'product_control',
      //   phoneChannel,
      //   { action: 'check_wifi' },
      //   'firebase',
      //   deviceChannel
      // );

      firebase.sendAction(
        mailProductId,
        password,
        action,
        res => {
          console.log('Result: ', res);
          if (res) {
            const { status } = res.data;
            if (status) {
              // SET ACTIVE DEVICE
              // const autonomousContext = AutonomousContext.getShareManager();
              // autonomousContext.setActiveDevice(product);
              // this.props.changeProduct(productId);
              console.log('Check incognito start successfully');
              this.setState({
                loading: false
              });
            } else {
              console.log('Timeout check wifi');

              this.setState(
                {
                  loading: false
                },
                () => this.showAlertOffline('Miner is offline. Can\'t connect')
              );
            }
          } else {
            console.log('Timeout check wifi');
            this.setState(
              {
                loading: false
              },
              () => this.showAlertOffline('Miner is offline. Can\'t connect')
            );
          }
        },
        5
      );
    }
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
        isFetching:true
      });
      // const list: [] = await this.getListLocalDevice();
      let list: [] = await this.fetchProductList();
      list = _.isEmpty(list)?await this.getListLocalDevice():list.reverse();
      // let list: [];
      console.log(TAG, 'handleRefresh list = ', list);
      this.setState({
        listDevice: list,
        isFetching: false
      });
    }
  };
  getListLocalDevice = async () => {
    const listDevice = await LocalDatabase.getListDevices();
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
        this.setState(
          {
            loading: false
          },
          () => {
            if (message) {
              ViewUtil.showAlert(message);
            }
          }
        );
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
            The Miner
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
  render() {
    const {
      listDevice,
      isFetching,
      isLoadMore,
      loading
    } = this.state;
    
    return (
      <Container styleContainScreen={style.container}>
        {this.renderHeader()}
        <Text style={style.header2}>You have mined so far</Text>
        <Text style={style.header3}>
          <Text style={style.header3_child}>$</Text>0.00
        </Text>
        <DialogLoader loading={loading} />
        <FlatList
          contentContainerStyle={_.isEmpty(listDevice) ? { flexGrow: 1 }:undefined}
          style={style.list}
          data={listDevice}
          keyExtractor={item => String(item.id)}
          onEndReachedThreshold={0.7}
          ListEmptyComponent={this.renderEmptyComponent()}
          renderItem={({ item,index }) => {
            return (
              <HomeMineItem onPress={this.handleItemDevicePress} isActive={index === 0} key={item.id} containerStyle={style.itemList} item={item} />
            );
          }}
          onRefresh={this.handleRefresh}
          refreshing={isFetching && !isLoadMore}
          onEndReached={this.handleLoadMore}
        />
      </Container>
    );
  }
}

HomeMine.propTypes = {};

HomeMine.defaultProps = {};
export default connect(
  state => ({}),
  dispatch => ({
  })
)(HomeMine);
