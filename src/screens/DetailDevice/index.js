import BaseScreen from '@screens/BaseScreen';

import FirebaseService, {
  DEVICE_CHANNEL_FORMAT,
  FIREBASE_PASS,
  MAIL_UID_FORMAT,
  PHONE_CHANNEL_FORMAT
} from '@services/FirebaseService';

import _ from 'lodash';
import React from 'react';
import { Alert, View,Switch } from 'react-native';
import { ButtonGroup, ListItem } from 'react-native-elements';
import Action from '@src/models/Action';
import DialogLoader from '@src/components/DialogLoader';
import style from './style';

export const TAG = 'DetailDevice';
const buttonsTab = ['Chain Store', 'Earn So Far', 'History'];

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
    props.navigation.setParams({ title: productName });
  }

  componentDidMount() {
    // this.checkStatus('incognito');
    this.checkStatus('eth20');
  }

  handleUpdateIndex = selectedIndex => {
    this.setState({
      selectedIndex: selectedIndex
    });
  };

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
      <View style={style.container}>
        <DialogLoader loading={loading} />
        
        <ButtonGroup
          onPress={this.handleUpdateIndex}
          selectedIndex={selectedIndex}
          buttons={buttonsTab}
          containerStyle={{ height: 40 }}
        />
        <ListItem
          containerStyle={{
            borderBottomWidth: 0,
            backgroundColor: 'white',
            margin: 20
          }}
          switchButton
          hideChevron
          rightElement={<Switch onValueChange={this.handleSwitchIncognito} />}
          
          switched={statusChain.incognito}
          title="incognito"
          underlayColor="transparent"
          subtitle="Stakeing Yield 30%"
          rightTitle={
            _.isEmpty(dataChain.incognito.message)
              ? 'Status'
              : dataChain.incognito.message
          }
        />
      </View>
    );
  }
}

DetailDevice.propTypes = {};

DetailDevice.defaultProps = {};
export default DetailDevice;
