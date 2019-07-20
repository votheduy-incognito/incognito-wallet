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
import images from '@src/assets';
import Container from '@components/Container';
import HistoryMined from '@src/components/HistoryMined';
import routeNames from '@src/router/routeNames';
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
    const productName = device ? device.product_name : '';
    this.state = {
      loading: false,
      selectedIndex: 0,
      statusChain: {
        eth20: false,
        incognito: false
      },
      dataChain: {
        eth20: {},
        incognito: {}
      },
      device: device
    };
    this.productName = productName;
    props.navigation.setParams({ title: productName });
  }

  componentDidMount() {
    // this.checkStatus('incognito');
    this.checkStatus('eth20');
  }

  pingDevice = async (product, actionExcute: 'start', chain = 'incognito') => {
    let productId = product.product_id;
    console.log('ProductId: ', product.product_id);
    if (productId) {
      this.setState({
        loading: true
      });
      const firebase = FirebaseService.getShareManager();
      let mailProductId = `${productId}${MAIL_UID_FORMAT}`;
      let password = `${FIREBASE_PASS}`;

      let phoneChannel = `${productId}${PHONE_CHANNEL_FORMAT}`;
      let deviceChannel = `${productId}${DEVICE_CHANNEL_FORMAT}`;
      const action = new Action(
        chain,
        phoneChannel,
        { action: actionExcute, chain: chain, type: '', privateKey: '' },
        'firebase',
        deviceChannel
      );
      firebase.sendAction(
        mailProductId,
        password,
        action,
        res => {
          console.log('Result: ', res);
          let { dataChain, statusChain } = this.state;
          if (res) {
            const data = res.data || {};
            const { status = -1 } = data;

            if (status) {
              dataChain[chain] = data;
              const value = Number(data.data).toString();
              statusChain[chain] =
                (_.isEqual(actionExcute, 'status') && value === '1') ||
                actionExcute === 'start';
              this.setState({
                loading: false,
                dataChain: dataChain,
                statusChain: statusChain
              });
              // this.showAlertOffline(
              //   `${chain} ${actionExcute} successfully ${actionExcute}`
              // );
            } else {
              console.log('Timeout check wifi');

              dataChain[chain] = { ...dataChain[chain], message: 'Unknown' };
              this.setState(
                {
                  loading: false,
                  dataChain
                },
                () => this.showAlertOffline('Miner is offline. Can\'t connect')
              );
            }
          } else {
            console.log('Timeout check wifi');
            dataChain[chain] = { ...dataChain[chain], message: 'Unknown' };
            this.setState(
              {
                loading: false,
                dataChain
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

  checkStatus = chain => {
    const { device } = this.state;
    const action = 'status';
    this.pingDevice(device, action, chain);
  };

  handleSwitchIncognito = isSwitch => {
    let { device,statusChain } = this.state;
    
    statusChain.incognito = isSwitch;
    const action = isSwitch ? 'start' : 'stop';
    this.pingDevice(device, action);
    this.setState({
      statusChain
    });
  };
  handleSwitchEth = isSwitch => {
    let { device,statusChain } = this.state;
    const action = isSwitch ? 'start' : 'stop';
    this.pingDevice(device, action, 'eth20');
    statusChain.eth20 = isSwitch;
    this.setState({
      statusChain
    });
  };

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
        leftComponent={(
          <Icon
            size={25}
            name='ios-arrow-back'
            type='ionicon'
            color='#ffffff'
            onPress={() => {
              this.onPressBack();
            }}
          />
        )}
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
          <Text style={style.group2_container_value2}>Mining</Text>
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
      selectedIndex,
      device,
      statusChain,
      dataChain,
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
                  size: 15,name:'control-play', type:'simple-line-icon', color:'black'
                }}
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
