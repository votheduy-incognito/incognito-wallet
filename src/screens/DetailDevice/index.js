import BaseScreen from '@screens/BaseScreen';

import FirebaseService, {
  DEVICE_CHANNEL_FORMAT,
  FIREBASE_PASS,
  MAIL_UID_FORMAT,
  PHONE_CHANNEL_FORMAT
} from '@services/FirebaseService';

import _ from 'lodash';
import React from 'react';
import { Alert, View,ScrollView,Image,Text } from 'react-native';
import { ListItem, Icon,Button, Header } from 'react-native-elements';
import Action from '@src/models/Action';
import DialogLoader from '@src/components/DialogLoader';
import images, { imagesVector } from '@src/assets';
import Container from '@components/Container';
import HistoryMined from '@src/components/HistoryMined';
import routeNames from '@src/router/routeNames';
import DeviceService, { LIST_ACTION } from '@src/services/DeviceService';
import Device from '@src/models/device';
import { onClickView } from '@src/utils/ViewUtil';
import Util from '@src/utils/Util';
import APIService from '@src/services/api/miner/APIService';
import style from './style';

export const TAG = 'DetailDevice';

class DetailDevice extends BaseScreen {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params && !_.isEmpty(params.title) ? params.title : 'Details'
    };
  };

  constructor(props) {
    super(props);
    const { params } = props.navigation.state;
    const device = params ? params.device : null;
    this.productName = device ? device.product_name : '';
    this.state = {
      loading: false,
      selectedIndex: 0,
      device: Device.getInstance(device)
    };
    
    props.navigation.setParams({ title: this.productName });
  }

  sendPrivateKey = async(chain='incognito')=>{
    let {device} = this.state;
    try {
      if(!_.isEmpty(device)){
        this.setState({
          loading: true
        });
        const actionPrivateKey = LIST_ACTION.GET_IP;
        const dataResult = await Util.excuteWithTimeout(DeviceService.send(device.data,actionPrivateKey,chain,Action.TYPE.PRODUCT_CONTROL),4);
        console.log(TAG,'sendPrivateKey send dataResult = ',dataResult);
        const { status = -1, data, message= ''} = dataResult;
        if(status === 1){
          const action:Action = DeviceService.buildAction(device.data,LIST_ACTION.START,{product_id:device.data.product_id, privateKey:'HIENTON-PrivateKEY'},chain,'incognito');
          const params = {
            type:action?.type||'',
            data:action?.data||{}
          };
          console.log(TAG,'sendPrivateKey send init data = ',params);
          const response = await APIService.sendPrivateKey(data,params);
          console.log(TAG,'sendPrivateKey send post data = ',response);
        }
      }
    } catch (error) {
      console.log(TAG,'sendPrivateKey error = ',error);
    }finally{
      this.setState({
        loading: false
      });
    }
  }

  componentDidMount() {
    this.checkStatus('incognito');
    // this.checkStatus('eth20');
  }
  /**
   *
   * action : LIST_ACTION
   * @memberof DetailDevice
   */
  callAndUpdateAction = async (action:{},chain = 'incognito')=>{
    let {device} = this.state;
    try {
      if(!_.isEmpty(device)){
        this.setState({
          loading: true
        });
        const dataResult = await Util.excuteWithTimeout(DeviceService.send(device.data,action,chain),4);
        console.log(TAG,'callAndUpdateAction send dataResult = ',dataResult);
        const { status = -1, data, message= 'Offline',productId = -1 } = dataResult;
      
        if(device.data.product_id === productId ){
          device.data.status ={
            code:status,
            message:message
          };
        }else{
          device.data.status = Device.offlineStatus();
        }
      }
    } catch (error) {
      device.data.status = Device.offlineStatus();
      console.log(TAG,'callAction error = ',error);
    }finally{
      console.log(TAG,'callAction finally = ',device.toJSON());
      this.setState({
        loading: false,
        device:device
      });
    }
  }

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

  checkStatus = chain => {
    const action = LIST_ACTION.CHECK_STATUS;
    this.callAndUpdateAction(action, chain);
  };

  handleSwitchIncognito = onClickView(async () => {
    const {
      device,
      loading
    } = this.state;
    if(!loading){
      //get ip to send private key
      // const isStarted = device.data.status.code === Device.CODE_START;
      // if(!isStarted){
      //   const result = await this.sendPrivateKey('incognito');
      // }
      // const action = isStarted ? LIST_ACTION.STOP : LIST_ACTION.START;
      // await this.callAndUpdateAction(action);
      const result = await this.sendPrivateKey('incognito');
    }
    
  });
  
  renderHeader = () => {
    const title = this.productName|| 'Details';
    return (
      <Header
        containerStyle={style.containerHeader}
        centerComponent={(
          <Text style={style.titleHeader}>
            {title}
          </Text>
        )}
        leftComponent={imagesVector.ic_back({onPress:this.onPressBack})}
      />
    );
  };
  handlePressWithdraw =()=>{
    this.goToScreen(routeNames.Withdraw);
  }
  handlePressStake =()=>{
    this.goToScreen(routeNames.AddStake);
  }

  renderGroupBalance = ()=>{
    const {device} = this.state;
    return (
      <View style={style.group2_container}>
        <View style={style.group2_container_container}>
          <Text style={style.group2_container_title}>YOUR BALANCE</Text>
          <Text style={style.group2_container_value}>0 BTC</Text>
          <Button
            titleStyle={style.group2_container_button_text}
            buttonStyle={style.group2_container_button}
            onPress={this.handlePressStake}
            title='Add more stake'
          />
        </View>
        <View style={style.group2_container_container2}>
          <Text style={style.group2_container_title2}>STATUS</Text>
          <Text style={style.group2_container_value2}>{device.statusMessage()}</Text>
          <View style={{flex:1,justifyContent:'flex-end'}}>
            <Button
              titleStyle={style.group2_container_button_text}
              buttonStyle={style.group2_container_button2}
              onPress={this.handlePressWithdraw}
              title='Withdraw'
            />
          </View>
        </View>
      </View>
    );
  }

  render() {
    const {
      device,
      loading
    } = this.state;
    const { product_name } = device || {};
    return (
      <Container styleRoot={style.container} backgroundTop={{source:images.bg_top_detail,style:style.imageTop}}>
        {this.renderHeader()}
        <Image style={style.bg_top} source={images.bg_top_device} />
        <DialogLoader loading={loading} />
        <ScrollView>
          <ListItem
            containerStyle={style.top_container}
            hideChevron
            rightElement={(
              <Button
                type="outline"
                buttonStyle={style.top_button_action}
                icon={{
                  size: 15,name:device.isStartedChain()?'control-pause' :'control-play', type:'simple-line-icon', color:'black'
                }}
                onPress={this.handleSwitchIncognito}
                title={null}
              />
            )}
            subtitleStyle={style.top_container_subtitle}
            titleStyle={style.top_container_title}
            title="Node"
            subtitle="Incognito Network"
          />
          {this.renderGroupBalance()}
          <HistoryMined containerStyle={style.group2_container} listItems={[device,device,device,device,device,device]} />
        </ScrollView>
      </Container>
    );
  }
}

DetailDevice.propTypes = {};

DetailDevice.defaultProps = {};
export default DetailDevice;
