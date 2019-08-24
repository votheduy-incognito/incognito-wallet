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
import accountService from '@src/services/wallet/accountService';
import { connect } from 'react-redux';
import { accountSeleclor, tokenSeleclor } from '@src/redux/selectors';
import PropTypes from 'prop-types';
import CreateAccount from '@screens/CreateAccount';
import { DEVICES } from '@src/constants/miner';
import VirtualDeviceService from '@src/services/VirtualDeviceService';
import convert from '@src/utils/convert';
import common from '@src/constants/common';
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
    const {navigation,wallet,token}= props;
    const { params } = navigation.state;
    const device = params ? params.device : null;
    this.productName = device ? device.product_name : '';
    // console.log(TAG,'constructor token',token);
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

  async componentDidMount() {
    await this.checkStatus('incognito');
    this.fetchData();
  }

  set Loading(isLoading){
    this.setState({
      loading:isLoading
    });
  }

  fetchData = async ()=>{
    // get balance
    const {device,wallet} = this.state;
    let dataResult = {};
    switch(device.Type){
    case DEVICES.VIRTUAL_TYPE:{
     
      dataResult = await VirtualDeviceService.getRewardAmount(device) ?? {};
      console.log(TAG,'fetchData VIRTUAL_TYPE ',dataResult);
      const {Result={}} = dataResult;
      let balancePRV = convert.toHumanAmount(Result['PRV'],common.DECIMALS['PRV']);
      balancePRV = _.isNaN(balancePRV)?0:balancePRV;
      const listFollowingTokens = [{
        symbol: 'PRV',
        name: 'Privacy',
        decimals: common.DECIMALS['PRV'],
        pDecimals: common.DECIMALS['PRV'],
        type: 0,
        amount:balancePRV,
        pSymbol: 'pPRV',
        default: true,
        userId: 0,
        verified: true }];
      this.setState({
        listFollowingTokens,
        balancePRV:balancePRV
      });
        
      break;
    }
    default:{
      const account = await  this.props.getAccountByName(device.accountName());
      const listFollowingTokens = (!_.isEmpty(account) && await accountService.getFollowingTokens(account,wallet))||[];
      const balance = await device.balanceToken(account,wallet);
      this.setState({
        accountMiner:account,
        listFollowingTokens,
        balancePRV:balance
      });
        
    }
    }
    
   
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
        const { data={status:Device.offlineStatus()}, productId = -1 } = dataResult;
      
        if(device.data.product_id === productId ){
          device.Status = data.status;
        }else{
          device.Status = Device.offlineStatus();
        }
      }
    } catch (error) {
      device.Status = Device.offlineStatus();
      console.log(TAG,'callAction error = ',error);
    }finally{
      // console.log(TAG,'callAction finally = ',device.toJSON());
      this.setState({
        loading: false,
        device:device
      });
    }
  }

  checkStatus = async (chain='incognito')  => {
    let {device} = this.state;
    console.log(TAG,'checkStatus begin ',device.Type);
    switch(device.Type){
    case DEVICES.VIRTUAL_TYPE:{
      const dataResult = await VirtualDeviceService.getChainMiningStatus(device) ?? {};
      const { status = -1, data={status:Device.offlineStatus()},productId = -1 } = dataResult;
      console.log(TAG,'checkStatus begin VIRTUAL_TYPE',dataResult);
      if(_.isEqual(status,1)){
        
        device.Status = data.status;
        this.setState({
          device:device
        });
      }else{
        this.setDeviceOffline();
      }
      break;
    }
    default:{
      const action = LIST_ACTION.CHECK_STATUS;
      await this.callAndUpdateAction(action, chain);
    }
    }
  };
  setDeviceOffline =()=>{
    let {device} = this.state;
    device.Status = Device.offlineStatus();
    this.setState({
      device:device,
    });
  }

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
        this.Loading = true;
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
        this.Loading = false;
      }
      
    }
    
  });
  
  renderHeader = () => {
    const title = this.productName|| 'Details';
    return (
      <Header
        containerStyle={style.containerHeader}
        centerComponent={(
          <Text numberOfLines={1} style={style.titleHeader}>
            {title}
          </Text>
        )}
        // rightComponent={(
        //   <Button
        //     title="reset device"
        //     onPress={onClickView( async()=>{
        //       const {device} = this.state;
        //       this.Loading = true;
        //       const result = await DeviceService.reset(device);
        //       const {status = -1,message = 'fail'} = result||{};
        //       this.Loading = false;
        //       // await this.checkStatus('incognito');
        //       alert(status === 1 ? 'Success':message);

        //     })}
        //   />
        // )}
        leftComponent={imagesVector.ic_back({onPress:this.onPressBack})}
      />
    );
  };

  handlePressWithdraw = onClickView(async()=>{
    const {device,accountMiner,wallet} = this.state;
    this.Loading = true;
    const result = await device.requestWithdraw(accountMiner,wallet,'').catch(e=>console.log);
    !_.isEmpty(result) && await this.fetchData();
    this.Loading = false;
  });

  handlePressStake = onClickView(async ()=>{
    // hienton test
    const {device} = this.state;
    // let listDeviceTest = await LocalDatabase.getListDevices();
    // const deviceJson = device.toJSON();
    // const time = Date.now().toString();
    // const deviceToClone = Device.getInstance({...deviceJson,product_name:`HIEN_TEST-${time}`,product_id:`${deviceJson.product_id}-${time}`});
    // listDeviceTest.push(deviceToClone);
    // await LocalDatabase.saveListDevices(listDeviceTest);
    // this.goToScreen(routeNames.HomeMine);
    
    this.goToScreen(routeNames.AddStake,{
      accountInfo:{
        minerAccountName: device.accountName(),
        funderAccountName:device.accountName()
      }
    });
  });

  renderGroupBalance = ()=>{
    const {device,balancePRV = 0,accountMiner} = this.state;
    // const isHaveWallet =  !_.isEmpty(accountMiner);
    const isHaveWallet =  !device.isOffline();
    
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
            <Text style={[style.group2_container_value2,Device.getStyleStatus(device.Status.code)]}>{device.statusMessage()}</Text>
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
    const bgTop = device.Type === DEVICES.VIRTUAL_TYPE ?images.bg_top_virtual_device:images.bg_top_device;
    const bgRootTop = device.Type === DEVICES.VIRTUAL_TYPE ?0: images.bg_top_detail;
    return (
      <Container styleRoot={style.container} backgroundTop={{source:bgRootTop,style:[style.imageTop,{backgroundColor:'#01828A'}]}}>
        {this.renderHeader()}
        <Image style={style.bg_top} source={bgTop} />
        <DialogLoader loading={loading} />
        <View style={{width: 0,height: 0,display:'none'}}>
          <CreateAccount ref={this.viewCreateAccount} />
        </View>
        <ScrollView>
          <ListItem
            containerStyle={style.top_container}
            hideChevron
            rightElement={_.isEqual(device.Type,DEVICES.MINER_TYPE) && (
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
    token: tokenSeleclor.pTokens(state)
  }),
  mapDispatch
)(DetailDevice);

