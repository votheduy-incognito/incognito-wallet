import Container from '@components/Container';
import BaseScreen from '@screens/BaseScreen';
import CreateAccount from '@screens/CreateAccount';
import images, { imagesVector } from '@src/assets';
import DialogLoader from '@src/components/DialogLoader';
import HeaderBar from '@src/components/HeaderBar/HeaderBar';
import HistoryMined from '@src/components/HistoryMined';
import common from '@src/constants/common';
import { DEVICES } from '@src/constants/miner';
import Device from '@src/models/device';
import { accountSeleclor, tokenSeleclor } from '@src/redux/selectors';
import routeNames from '@src/router/routeNames';
import DeviceService, { LIST_ACTION } from '@src/services/DeviceService';
import VirtualDeviceService from '@src/services/VirtualDeviceService';
import accountService from '@src/services/wallet/accountService';
import format from '@src/utils/format';
import LocalDatabase from '@src/utils/LocalDatabase';
import { onClickView } from '@src/utils/ViewUtil';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-elements';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { connect } from 'react-redux';
import AdvanceOption from './AdvanceOption';
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
    const device = Device.getInstance(params?.device ||{});
    this.titleBar = device.Type == DEVICES.VIRTUAL_TYPE?'Virtual Node':'Node';
    this.productName = device.Name;
    // console.log(TAG,'constructor token',token);
    this.state = {
      loading: false,
      selectedIndex: 0,
      accountMiner:{},
      isStaked:undefined,
      wallet:wallet,
      isShowMessage:false,
      balancePRV:0,
      listFollowingTokens:[],
      device: device
    };
    this.advanceOptionView = React.createRef();
    this.viewCreateAccount = React.createRef();
    navigation.setParams({ title: this.titleBar });
  }

  async componentDidMount() {
    super.componentDidMount();
    console.log(TAG,'componentDidMount begin');
    // await this.checkStatus('incognito');
    // await this.checkAndUpdateInfoVirtualNode();
    // this.fetchData();
  }

  onResume = async ()=>{
    console.log(TAG,'onResume begin');
    const {device } = this.state;
    const product_id = device.data.product_id;
    if(!_.isEmpty(product_id)){
      let listDevice = await LocalDatabase.getListDevices()||[];
      const deviceNewJSON =  listDevice.find(item=>_.isEqual(item.product_id,product_id));
      console.log(TAG,'onResume begin new -- ',deviceNewJSON);
      this.setState({
        device:Device.getInstance(deviceNewJSON)
      });
    }
    await this.checkStatus('incognito');
    await this.checkAndUpdateInfoVirtualNode();
    this.fetchData();
  }

  set IsStaked (isStake:Boolean){
    this.setState({
      isStaked:isStake
    });
  }

  get IsStaked(){
    return this.state.isStaked;
  }

  checkAndUpdateInfoVirtualNode = async ()=>{
    
    const {device,wallet} = this.state;
    const {getAccountByName,listAccount} = this.props;
    let account = await getAccountByName(device.accountName());
    if(device.Type == DEVICES.VIRTUAL_TYPE){
      // with test-node publicKey
      // let keyCompare = await VirtualDeviceService.getPublicKeyMining(device);

      // dev-test
      const keyCompare = await VirtualDeviceService.getPublicKeyMining(device)??'';
  
      // const publicKey = '16yUvbgiXUZfwuWafBcXX4oiyYVui57e1oMtEyRCwkHemeqKvf9';
      // const isRegular = !_.includes(keyCompare,account?.BlockProducerKey);
      console.log(TAG,'checkAndUpdateInfoVirtualNode listAccount ',listAccount);
      // console.log(TAG,'checkAndUpdateInfoVirtualNode publicKey ',keyCompare);

      const isRegular = !_.isEqual(account?.PublicKeyCheckEncode,keyCompare);
      if(isRegular){
      // keyCompare = _.split(keyCompare,':')[1]||keyCompare;
        console.log(TAG,'checkAndUpdateInfoVirtualNode1111111 publicKey ',keyCompare);
        account = await accountService.getAccountWithBLSPubKey(keyCompare,wallet);
        console.log(TAG,'checkAndUpdateInfoVirtualNode account ',account);
        !_.isEmpty(account) && await device.saveAccount({name:account.name});
      }
    }
    this.setState({
      accountMiner:account
    });
  }

  createListFollowingToken=(result:{},listprivacyCustomToken:Array)=>{
    let amount = 0;
    // console.log(TAG,'createListFollowingToken begin ',listprivacyCustomToken);
    return Object.keys(result).map((value,index)=>{
      let ObjFinded = _.find(listprivacyCustomToken,(item)=>_.isEqual(item.tokenId,value))||{
        symbol: value,
        name: 'Privacy',
        decimals: common.DECIMALS['PRV'],
        pDecimals: common.DECIMALS['PRV'],
        type: 0,
        amount:amount,
        pSymbol: 'pPRV',
        default: true,
        userId: 0,
        verified: true };
    
      // console.log(TAG,'createListFollowingToken begin findd ---  ',ObjFinded);
      amount = format.amountFull(result[value],ObjFinded['pDecimals']??common.DECIMALS[value]);
      amount = _.isNaN(amount)?0:amount;
      return {
        ...ObjFinded,
        amount:amount,
      };
    });
  }

  fetchData = async ()=>{
    // get balance
    const {device,wallet,accountMiner} = this.state;
    const {listTokens} = this.props;
    let dataResult = {};
    let balancePRV = 0;
    let listFollowingTokens = [];
    const account = _.isEmpty(accountMiner)? await this.props.getAccountByName(device.accountName()):accountMiner;
    // const stakerStatus =(!_.isEmpty(account)&& !_.isEmpty(wallet)? await accountService.stakerStatus(account,wallet).catch(console.log):-1)??{};
    // console.log(TAG,'fetchData stakerStatus ',stakerStatus);

    // const { Role= -1, ShardID= 0 } = stakerStatus;
    let isStaked = -1 ;
    switch(device.Type){
    case DEVICES.VIRTUAL_TYPE:{
      const stakerStatus =await VirtualDeviceService.getPublicKeyRole(device) ??{};
      console.log(TAG,'fetchData VIRTUAL_TYPE stakerStatus ',stakerStatus);

      const { Role= -1, ShardID= 0 } = stakerStatus;
      isStaked = Role!=-1 ;
      console.log(TAG,'fetchData VIRTUAL_TYPE getPublicKeyRole ',stakerStatus);

      const listprivacyCustomToken:[] = listTokens;
      dataResult = await VirtualDeviceService.getRewardFromMiningkey(device) ?? {};
      console.log(TAG,'fetchData VIRTUAL_TYPE ',dataResult);
      const {Result={}} = dataResult;
      const PRV = Result['PRV']??0;
      // balancePRV = convert.toHumanAmount(PRV,common.DECIMALS['PRV']);
      balancePRV = format.amount(PRV,common.DECIMALS['PRV']);
      console.log(TAG,'fetchData VIRTUAL_TYPE 01');
      balancePRV = _.isNaN(balancePRV)?0:balancePRV;
      console.log(TAG,'fetchData VIRTUAL_TYPE 02');

      listFollowingTokens = this.createListFollowingToken(Result,listprivacyCustomToken);
      break;
    }
    default:{
      const stakerStatus =(!_.isEmpty(account)&& !_.isEmpty(wallet)? await accountService.stakerStatus(account,wallet).catch(console.log):-1)??{};
      console.log(TAG,'fetchData stakerStatus ',stakerStatus);

      const { Role= -1, ShardID= 0 } = stakerStatus;
      isStaked = Role!=-1 ;
      listFollowingTokens = (!_.isEmpty(account) && await accountService.getFollowingTokens(account,wallet))||[];
      listFollowingTokens = listFollowingTokens.map(async item=>{ 
        const objMerge = {id:item.id,name:item.name,...item.metaData};
        let amount = await device.balanceToken(account,wallet,objMerge.id);
        amount = format.amountFull(amount,objMerge['pDecimals']);
        amount = _.isNaN(amount)?0:amount;
        return {...objMerge,amount:amount};
      });

      listFollowingTokens = await Promise.all(listFollowingTokens);

      console.log(TAG,'fetchData NODE listFollowingTokens = ',listFollowingTokens);
      balancePRV = await device.balanceToken(account,wallet);        
    }
    }
    
    this.setState({
      accountMiner:account,
      listFollowingTokens,
      isStaked:isStaked,
      balancePRV:balancePRV
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
  // renderHeader = () => {
  //   const title = this.titleBar|| 'Details';
  //   return (
  //     <Header
  //       containerStyle={style.containerHeader}
  //       centerComponent={(
  //         <Text numberOfLines={1} style={style.titleHeader}>
  //           {title}
  //         </Text>
  //       )}
  //       leftComponent={imagesVector.ic_back({onPress:this.onPressBack},{paddingLeft:0,paddingRight:scaleInApp(30)})}
  //     />
  //   );
    
  // };
  renderHeader = () => {
    const {navigation} = this.props;
    const title = this.titleBar|| 'Details';
    const options= {
      title: title,
      headerBackground:'transparent',
      headerTitleStyle:style.titleHeader
    };
    return (
      <HeaderBar
        navigation={navigation}
        index={1}
        scene={{descriptor:{options}}} 
      />
    );
  };

  handlePressWithdraw = onClickView(async()=>{
    /* next release
    const {device,accountMiner,wallet} = this.state;
    this.Loading = true;
    const result = await device.requestWithdraw(accountMiner,wallet,'').catch(console.log);
    !_.isEmpty(result) && await this.fetchData();
    this.Loading = false;
    */
    this.showToastMessage('Withdrawals will be enabled once the mainnet launches in October 2019.');
  });

  handlePressStake = onClickView(async ()=>{
    
    const {device} = this.state;
    // hienton test
    // let listDeviceTest = await LocalDatabase.getListDevices();
    // const deviceJson = device.toJSON();
    // const time = Date.now().toString();
    // const deviceToClone = Device.getInstance({...deviceJson,product_name:`HIEN_TEST-${time}`,product_id:`${deviceJson.product_id}-${time}`});
    // listDeviceTest.push(deviceToClone);
    // await LocalDatabase.saveListDevices(listDeviceTest);
    // this.goToScreen(routeNames.HomeMine);
    
    this.goToScreen(routeNames.AddStake,{
      accountInfo:{
        minerAccountName:device.accountName(),
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
            <Text style={style.group2_container_title}>TOTAL BALANCE</Text>
            <Text numberOfLines={1} style={style.group2_container_value}>{`${balancePRV} PRV`}</Text>
            {/* {isHaveWallet&&(
              <Button
                titleStyle={style.group2_container_button_text}
                buttonStyle={style.group2_container_button}
                onPress={this.handlePressStake}
                title='Stake'
              />
            )} */}
          </View>
          <View style={style.group2_container_container2}>
            {isHaveWallet&&(
              <Button
                titleStyle={style.group2_container_button_text}
                buttonStyle={style.group2_container_button2}
                onPress={this.handlePressWithdraw}
                title='Withdraw'
              />
            )}
            {!isHaveWallet && (
              <Text style={style.textWarning}>Your device is offline.</Text>
            )}
          </View>
        </View>
        
      </View>
    );
  }
  renderTop = ()=>{
    const {device,isStaked} = this.state;
    const isCallStaked = device.isCallStaked;
    const stakeTitle = isStaked?'Stop':'Run';
    return (
      <TouchableOpacity
        style={style.top_container}
        onPress={()=>{
          if(__DEV__){
            const {device} = this.state;
            DeviceService.pingGetIP(device).then(data=>{
              this.showToastMessage('ping IP ' +JSON.stringify(data));
            });
          }
        }}
      >
        <View style={style.top_container_group}>
          <Text style={style.top_container_title} numberOfLines={1}>{this.productName}</Text>
          <Text style={[style.group2_container_value2,Device.getStyleStatus(device.Status.code)]}>{device.statusMessage()}</Text>
        </View>
        {!device?.isOffline() && device?.Type === DEVICES.MINER_TYPE && (
          <TouchableOpacity onPress={()=>{
          this.advanceOptionView?.current.open();
          // this.setState({isShowMessage:true});
          }}
          >
            {imagesVector.ic_setting()}
          </TouchableOpacity>
        )}
        {device.Type === DEVICES.VIRTUAL_TYPE && !device.isOffline() && !device.isEarning() && !isStaked &&!isCallStaked? (
          <Button
            titleStyle={style.group2_container_button_text}
            buttonStyle={style.group2_container_button}
            title={stakeTitle}
            onPress={onClickView( async()=>{
              const {accountMiner,isStaked} = this.state;
              if(!isStaked){
                if(!_.isEmpty(accountMiner)){
                  await this.handlePressStake();
                }else{
                  this.setState({
                    isShowMessage:true
                  });
                  
                  // this.showToastMessage('None of your keys are linked to this node.Please import the node`s private key');
                }
              }else{
              // udpdate status at local
                this.IsStaked = false;
              }
            })}
          />
        ):null}
      </TouchableOpacity>
    );
  }

  renderDialogNotify =()=>{
    const {isShowMessage} = this.state;
    return (
      <Dialog
        width={0.8}
        height={0.35}
        visible={isShowMessage}
        onTouchOutside={() => {
          this.setState({ isShowMessage: false });
        }}
      >
        <DialogContent style={style.dialog_container}>
          <Text style={style.dialog_title_text}>Import private key</Text>
          <View style={style.dialog_content}>
            <Text style={style.dialog_content_text}>No keys are currently linked to this node. Please import a private key.</Text>
          </View>
          <Button
            titleStyle={style.textTitleButton}
            buttonStyle={style.dialog_button}
            onPress={onClickView(()=>{
              this.setState({ isShowMessage: false });
              this.goToScreen(routeNames.ImportAccount);
            })}
            title='Import'
          />
        </DialogContent>
       
      </Dialog>
    );
  }

  render() {
    const {
      device,
      loading,
      listFollowingTokens
    } = this.state;
    const {navigation} = this.props;
    const isOffline = device?.isOffline()||false;
    const bgTop = device.Type === DEVICES.VIRTUAL_TYPE ?images.bg_top_virtual_device:images.bg_top_device;
    const bgRootTop = device.Type === DEVICES.VIRTUAL_TYPE ?0: images.bg_top_detail;
    return (
      <Container styleContainScreen={{paddingHorizontal:0}} styleRoot={style.container} backgroundTop={{source:bgRootTop,style:[style.imageTop,{backgroundColor:'#01828A'}]}}>
        {this.renderHeader()}
        <AdvanceOption
          ref={this.advanceOptionView}
          handleReset={async()=>{
            const result = await DeviceService.reset(device);
            if(result){
              // remove in call
              await LocalDatabase.removeDevice(device.toJSON());
              this.onPressBack();
            }
          }}
          handleUpdateUpdateFirware={async()=>{
            const result = await DeviceService.updateFirware(device);
            alert(`Update Firware result = ${JSON.stringify(result)}`);
          }}
          handleUpdateWifi={()=>{}}
        />
        <Image style={style.bg_top} source={bgTop} />
        <DialogLoader loading={loading} />
        <View style={{width: 0,height: 0,display:'none'}}>
          <CreateAccount navigation={navigation} ref={this.viewCreateAccount} />
        </View>
        <ScrollView>
          {this.renderTop()}
          {this.renderGroupBalance()}
          {!_.isEmpty(listFollowingTokens) &&<HistoryMined containerStyle={style.group2_container} listItems={listFollowingTokens} />}
          {this.renderDialogNotify()}
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
    listTokens:tokenSeleclor.pTokens(state),
    listAccount: accountSeleclor.listAccount(state)
  }),
  mapDispatch
)(DetailDevice);

