import BaseScreen from '@screens/BaseScreen';
import _ from 'lodash';
import React from 'react';
import { Alert, View,ScrollView,Image,Text } from 'react-native';
import { ListItem, Icon,Button, Header } from 'react-native-elements';
import DialogLoader from '@src/components/DialogLoader';
import images, { imagesVector } from '@src/assets';
import Container from '@components/Container';
import HistoryMined from '@src/components/HistoryMined';
import routeNames from '@src/router/routeNames';
import DeviceService, { LIST_ACTION } from '@src/services/DeviceService';
import Device from '@src/models/device';
import { onClickView } from '@src/utils/ViewUtil';
import Util from '@src/utils/Util';
import accountService from '@src/services/wallet/accountService';
import { connect } from 'react-redux';
import { accountSeleclor } from '@src/redux/selectors';
import PropTypes from 'prop-types';
import CreateAccount from '@screens/CreateAccount';
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
    const {navigation,wallet}= props;
    const { params } = navigation.state;
    const device = params ? params.device : null;
    this.productName = device ? device.product_name : '';
    this.state = {
      loading: false,
      selectedIndex: 0,
      accountMiner:{},
      wallet:wallet,
      balancePRV:0,
      listFollowingTokens:[],
      device: Device.getInstance(device)
    };
    this.viewCreateAccount = React.createRef();
    navigation.setParams({ title: this.productName });
  }

  // sendPrivateKey = async(chain='incognito')=>{
  //   let {device} = this.state;
  //   try {
  //     if(!_.isEmpty(device)){
  //       this.setState({
  //         loading: true
  //       });
  //       const actionPrivateKey = LIST_ACTION.GET_IP;
  //       const dataResult = await Util.excuteWithTimeout(DeviceService.send(device.data,actionPrivateKey,chain,Action.TYPE.PRODUCT_CONTROL),4);
  //       console.log(TAG,'sendPrivateKey send dataResult = ',dataResult);
  //       const { status = -1, data, message= ''} = dataResult;
  //       if(status === 1){
  //         const action:Action = DeviceService.buildAction(device.data,LIST_ACTION.START,{product_id:device.data.product_id, privateKey:'112t8rnX3rRvnpiSCBuA9ES9mzauoyoXXYkZmTqdQd7zfw3QVVFisFmouQ2JQJK1prdkaBaDWaiTtkzgfAkbUTPyXsgGkuJEBUtrE9vrMqhr'},chain,'incognito');
  //         const params = {
  //           type:action?.type||'',
  //           data:action?.data||{}
  //         };
  //         console.log(TAG,'sendPrivateKey send init data = ',params);
  //         const response = await APIService.sendPrivateKey(data,params);
        
  //         console.log(TAG,'sendPrivateKey send post data = ',response);
  //         return response;
  //       }
  //     }
  //   } catch (error) {
  //     console.log(TAG,'sendPrivateKey error = ',error);
  //   }finally{
  //     this.setState({
  //       loading: false
  //     });
  //   }

  //   return null;
  // }

  async componentDidMount() {
    this.checkStatus('incognito');
    this.fetchData();
  }

  fetchData = async ()=>{
    // get balance
    const {device,wallet} = this.state;
    const account = await  this.props.getAccountByName(device.Name);
    const listFollowingTokens = (!_.isEmpty(account) && await accountService.getFollowingTokens(account,wallet))||[];
    const balance = await device.balanceToken(account,wallet);
    this.setState({
      accountMiner:account,
      listFollowingTokens,
      balancePRV:balance
    });
    // console.log(TAG,'fetchData begin ',balance);
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
        const dataResult = await DeviceService.send(device.data,action,chain);
        console.log(TAG,'callAndUpdateAction send dataResult = ',dataResult);
        const { status = -1, data={status:Device.offlineStatus()}, productId = -1 } = dataResult;
      
        if(status === 1 && device.data.product_id === productId ){
          device.Status = data.status;
        }else{
          device.Status = Device.offlineStatus();
        }
      }
    } catch (error) {
      device.data.status = Device.offlineStatus();
      console.log(TAG,'callAction error = ',error);
    }finally{
      // console.log(TAG,'callAction finally = ',device.toJSON());
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

  checkStatus = async (chain='incognito')  => {
    const action = LIST_ACTION.CHECK_STATUS;
    await this.callAndUpdateAction(action, chain);
  };

  handleSwitchIncognito = onClickView(async () => {
    let {
      device,
      loading,accountMiner
    } = this.state;
    if(!loading){
      //get ip to send private key
      const isStarted = device.isStartedChain();
      const isOffline = device.isOffline();
      const action = isStarted ? LIST_ACTION.STOP : LIST_ACTION.START;
      if(!isStarted && !isOffline){
        this.setState({
          loading:true
        });
        if(_.isEmpty(accountMiner)){
          accountMiner = await this.viewCreateAccount?.current?.createAccount(device.Name);
          this.setState({
            accountMiner
          });
        }
        const {PrivateKey = '',AccountName = '',PaymentAddress = ''} = accountMiner;
        const result = await DeviceService.sendPrivateKey(device,PrivateKey,'incognito');
        const { status= -1 } = result;
        await this.checkStatus();
        this.setState({
          loading:false
        });
      }else{
        // await this.callAndUpdateAction(action);
      }
      
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
    const {device,balancePRV = 0,accountMiner} = this.state;
    const isHaveWallet =  !_.isEmpty(accountMiner);
    
    return (
      <View style={style.group2_container}>
        <View style={style.group2_container_group1}>
          <View style={style.group2_container_container}>
            <Text style={style.group2_container_title}>YOUR BALANCE</Text>
            <Text style={style.group2_container_value}>{`${balancePRV} PRV`}</Text>
            {isHaveWallet&&(
              <Button
                titleStyle={style.group2_container_button_text}
                buttonStyle={style.group2_container_button}
                onPress={this.handlePressStake}
                title='Stake'
              />
            )}
          </View>
          <View style={style.group2_container_container2}>
            <Text style={style.group2_container_title2}>STATUS</Text>
            <Text style={style.group2_container_value2}>{device.statusMessage()}</Text>
            <View style={{flex:1,justifyContent:'flex-end'}}>
              {isHaveWallet&&(
                <Button
                  titleStyle={style.group2_container_button_text}
                  buttonStyle={style.group2_container_button2}
                  onPress={this.handlePressWithdraw}
                  title='Withdraw'
                />
              )}
            </View>
          </View>
        </View>
        {!isHaveWallet && <Text style={style.textWarning}>Your Wallet is not found</Text>}
      </View>
    );
  }

  render() {
    const {
      device,
      loading,
      listFollowingTokens
    } = this.state;
    const isOffline = device?.isOffline()||false;
    
    return (
      <Container styleRoot={style.container} backgroundTop={{source:images.bg_top_detail,style:style.imageTop}}>
        {this.renderHeader()}
        <Image style={style.bg_top} source={images.bg_top_device} />
        <DialogLoader loading={loading} />
        <View style={{width: 0,height: 0,display:'none'}}>
          <CreateAccount ref={this.viewCreateAccount} />
        </View>
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
                disabled={isOffline}
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
          {!_.isEmpty(listFollowingTokens) &&<HistoryMined containerStyle={style.group2_container} listItems={listFollowingTokens} />}
        </ScrollView>
        
      </Container>
    );
  }
}

DetailDevice.propTypes = {
  getAccountByName:PropTypes.func.isRequired,
  wallet:PropTypes.object.isRequired
};

DetailDevice.defaultProps = {};

const mapDispatch = { };

export default connect(
  state => ({
    wallet:state.wallet,
    getAccountByName: accountSeleclor.getAccountByName(state),
  }),
  mapDispatch
)(DetailDevice);

