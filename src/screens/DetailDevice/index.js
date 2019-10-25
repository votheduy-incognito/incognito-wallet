import Container from '@components/Container';
import BaseScreen from '@screens/BaseScreen';
import CreateAccount from '@screens/CreateAccount';
import images, { imagesVector } from '@src/assets';
import { Text,ButtonExtension } from '@src/components/core';
import DialogLoader from '@src/components/DialogLoader';
import HeaderBar from '@src/components/HeaderBar/HeaderBar';
import HistoryMined from '@src/components/HistoryMined';
import common from '@src/constants/common';
import { DEVICES } from '@src/constants/miner';
import Device from '@src/models/device';
import { accountSeleclor, tokenSeleclor } from '@src/redux/selectors';
import routeNames from '@src/router/routeNames';
import APIService from '@src/services/api/miner/APIService';
import DeviceService, { LIST_ACTION } from '@src/services/DeviceService';
import VirtualDeviceService from '@src/services/VirtualDeviceService';
import accountService from '@src/services/wallet/accountService';
import { COLORS } from '@src/styles';
import format from '@src/utils/format';
import LocalDatabase from '@src/utils/LocalDatabase';
import Util from '@src/utils/Util';
import ViewUtil, { onClickView } from '@src/utils/ViewUtil';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Image, RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { connect } from 'react-redux';
import AdvanceOption from './AdvanceOption';
import Loader, { Earning } from './Loader';
import style from './style';

const FullLoader = DialogLoader;
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
      isFetchingCheckStatus:false,
      isetFetchingCheckAndUpdateInfoVirtualNode:false,
      selectedIndex: 0,
      accountMiner:{},
      isStaked:undefined,
      wallet:wallet,
      isShowMessage:false,
      isFetching:false,
      balancePRV:undefined,
      listFollowingTokens:null,
      device: device
    };
    this.advanceOptionView = React.createRef();
    this.viewCreateAccount = React.createRef();
    navigation.setParams({ title: this.titleBar });
  }

  onResume = async ()=>{
    console.log(TAG,'onResume begin');
    const {device,isFetching } = this.state;
    const product_id = device.ProductId;
    if(!_.isEmpty(product_id)){
      let listDevice = await LocalDatabase.getListDevices()||[];
      const deviceNewJSON =  listDevice.find(item=>_.isEqual(item.product_id,product_id));
      console.log(TAG,'onResume begin new -- ',deviceNewJSON);
      this.setState({
        isStaked:undefined,
        device:Device.getInstance(deviceNewJSON)
      });
    }
    if(!isFetching){
      this.setState({
        isFetching:true
      });
      await this.checkStatus('incognito');
      await this.checkAndUpdateInfoVirtualNode();
      await this.fetchData();
      this.setState({
        isFetching:false
      });
    }
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

      // dev-test
      const keyCompare = await VirtualDeviceService.getPublicKeyMining(device)??'';
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

  createListFollowingToken=(result:{},listprivacyCustomToken:Array,commission = 1)=>{
    let amount = 0;
    console.log(TAG,'createListFollowingToken begin ',commission);
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

      // console.log(TAG,'createListFollowingToken begin findd ---  ',ObjFinded,value);
      amount = !_.isNaN(result[value]) ? _.toNumber(result[value])*commission :0;
      amount = format.amountFull(amount,ObjFinded['pDecimals']??common.DECIMALS[value]);
      amount = _.isNaN(amount)?0:amount;
      return {
        ...ObjFinded,
        id:value,
        amount:amount,
      };
    });
  }

  fetchData = async ()=>{
    // get balance
    const {device,wallet,accountMiner} = this.state;
    const {listTokens,getAccountByName} = this.props;
    let dataResult = {};
    let balancePRV = 0;
    let listFollowingTokens = [];
    const account = _.isEmpty(accountMiner)? await getAccountByName(device.accountName()):accountMiner;
   
    let isStaked = -1 ;
    switch(device.Type){
    case DEVICES.VIRTUAL_TYPE:{
      const stakerStatus = await VirtualDeviceService.getPublicKeyRole(device) ??{};
      console.log(TAG,'fetchData VIRTUAL_TYPE stakerStatus ',stakerStatus);

      const { Role= -1, ShardID= 0 } = stakerStatus;
      isStaked = Role!=-1 ;
      console.log(TAG,'fetchData VIRTUAL_TYPE getPublicKeyRole ',stakerStatus);

      const listprivacyCustomToken:[] = listTokens;
      dataResult = await VirtualDeviceService.getRewardFromMiningkey(device) ?? {};
      console.log(TAG,'fetchData VIRTUAL_TYPE ',dataResult);
      const {Result={}} = dataResult;
      const PRV = Result['PRV']??0;
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

      dataResult = await VirtualDeviceService.getRewardAmount(device,device.PaymentAddressFromServer,true) ?? {} ;
      console.log(TAG,'fetchData getRewardAmount ',dataResult);
      const {Result={}} = dataResult;
      const PRV = Result['PRV']??0;
      balancePRV = format.amount(PRV,common.DECIMALS['PRV']);
      // console.log(TAG,'fetchData getRewardAmount 01');
      balancePRV = _.isNaN(balancePRV)?0:balancePRV;
      console.log(TAG,'fetchData getRewardAmount 02',balancePRV);

      listFollowingTokens = this.createListFollowingToken(Result,listTokens,device.CommissionFromServer??1);

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
        // console.log(TAG,'callAndUpdateAction send dataResult = ',dataResult);
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
    // console.log(TAG,'checkStatus begin ',device.Type);

    switch(device.Type){
    case DEVICES.VIRTUAL_TYPE:{
      const dataResult = await VirtualDeviceService.getChainMiningStatus(device) ?? {};
      const { status = -1, data={status:Device.offlineStatus()},productId = -1 } = dataResult;
      // console.log(TAG,'checkStatus begin VIRTUAL_TYPE',dataResult);
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

  handleWithdrawEachToken = onClickView(async(item)=>{
    const {device,accountMiner,wallet} = this.state;
    if(_.isEmpty(accountMiner) || _.isEmpty(item) ){
      this.setState({
        isShowMessage:true
      });
      return;
    }
    this.Loading = true;
    let result = null;

    switch(device.Type){
    case DEVICES.VIRTUAL_TYPE:{
      const id = item?.tokenId??'';
      console.log(TAG,'handleWithdrawEachToken VIRTUAL_TYPE id ',item);
      result = await device.requestWithdraw(accountMiner,wallet,_.includes(id,'PRV')?'':id).catch(console.log);
      break;
    }
    default:
      // call apiservice
      if(device){
        const {PaymentAddress,ValidatorKey} = accountMiner;
        result = await Util.excuteWithTimeout(APIService.requestWithdraw({ProductID:device.ProductId,qrCodeDeviceId:device.qrCodeDeviceId,ValidatorKey:ValidatorKey,PaymentAddress:PaymentAddress}),4).catch(console.log);

      }
      break;
    }
    if(!_.isNil(result)){
      if(result){
        this.showToastMessage('Withdrawing earnings to your Incognito Wallet. Balances will update in a few minutes.');
      }else{
        this.showToastMessage('Withdrawals will be enabled once the mainnet launches in October 2019.');
      }
    }
    this.Loading = false;

  });

  handlePressWithdraw = onClickView(async()=>{
    const {device,accountMiner,wallet,listFollowingTokens} = this.state;
    if(_.isEmpty(accountMiner)){
      this.setState({
        isShowMessage:true
      });
      return;
    }
    this.Loading = true;
    let result = null;

    switch(device.Type){
    case DEVICES.VIRTUAL_TYPE:{
      if( !_.isEmpty(listFollowingTokens) ){
        for(let i = 0;i<listFollowingTokens.length;i++){
          const id = listFollowingTokens[i]?.id||'';
          result = await device.requestWithdraw(accountMiner,wallet,_.includes(id,'PRV')?'':id).catch(console.log);
        }
      }
      break;
    }
    default:
      // call apiservice
      if(device){
        const {PaymentAddress,ValidatorKey} = accountMiner;
        result = await Util.excuteWithTimeout(APIService.requestWithdraw({ProductID:device.ProductId,qrCodeDeviceId:device.qrCodeDeviceId,ValidatorKey:ValidatorKey,PaymentAddress:PaymentAddress}),4).catch(console.log);

      }
      break;
    }
    if(!_.isNil(result)){
      if(result){
        this.showToastMessage('Withdrawing earnings to your Incognito Wallet. Balances will update in a few minutes.');
      }else{
        this.showToastMessage('Withdrawals will be enabled once the mainnet launches in October 2019.');
      }
    }
    this.Loading = false;

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
      },
    });
  });

  renderGroupBalance = ()=>{
    const {device,balancePRV = 0,accountMiner} = this.state;
    // const isHaveWallet =  !_.isEmpty(accountMiner);
    const isHaveWallet = !device.isOffline();
    const isWaiting =  _.isNil(balancePRV) || device.isWaiting();

    return (
      <View style={style.group2_container}>
        {isWaiting?<Loader />:(
          <>
            <View style={style.group2_container_group1}>
              <View style={style.group2_container_container}>
                <Text style={style.group2_container_title}>Balance</Text>
                {/* <Text numberOfLines={1} style={style.group2_container_value}>{`${balancePRV} PRV`}</Text> */}
              </View>
              <View style={style.group2_container_container2}>
                <ButtonExtension
                  disabled
                  disabledTitleStyle={style.group2_container_button_text}
                  disabledStyle={[style.group2_container_button2,{backgroundColor:'#93EAEF'}]}
                  titleStyle={style.group2_container_button_text}
                  buttonStyle={style.group2_container_button2}
                  onPress={this.handlePressWithdraw}
                  titleProps={{allowFontScaling:false}}
                  title='Withdraw'
                />
              </View>
            </View>
            {ViewUtil.lineComponent({style:{marginVertical:5}})}
            {this.renderListFollowingTokens()}
          </>
        )}
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
          const {device} = this.state;
          device && device.Type == DEVICES.MINER_TYPE && (DeviceService.pingGetIP(device).then(data=>{
            this.showToastMessage('ping IP ' +JSON.stringify(data));
          }));
        }}
      >
        <View style={style.top_container_group}>
          <Text style={style.top_container_title} numberOfLines={1}>{this.productName}</Text>
          <Text style={[style.group2_container_value2,Device.getStyleStatus(device.Status.code)]}>{device.statusMessage()}</Text>
        </View>
        <View style={style.top_container_right_group}>
          {device.isEarning() && (
            <Earning />
          )}
          {!device?.isOffline() && device?.Type === DEVICES.MINER_TYPE && (
            <TouchableOpacity onPress={()=>{
              this.advanceOptionView?.current.open();
            }}
            >
              {imagesVector.ic_setting()}
            </TouchableOpacity>
          )}
          {device.Type === DEVICES.VIRTUAL_TYPE && !device.isOffline() && !device.isEarning() && (!_.isNil(isStaked) && !isStaked) &&!isCallStaked? (
            <ButtonExtension
              titleStyle={style.group2_container_button_text}
              buttonStyle={style.group2_container_button}
              title={stakeTitle}
              onPress={onClickView(async()=>{
                const {accountMiner,isStaked} = this.state;
                if(!isStaked){
                  if(!_.isEmpty(accountMiner)){
                    await this.handlePressStake();
                  }else{
                    this.setState({
                      isShowMessage:true
                    });
                  }
                }else{
                // udpdate status at local
                  this.IsStaked = false;
                }
              })}
            />
          ):null}
        </View>
      </TouchableOpacity>
    );
  }

  renderDialogNotify =()=>{
    const {isShowMessage} = this.state;
    return (
      <Dialog
        width={0.8}
        height={0.3}
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
          <ButtonExtension
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

  renderListFollowingTokens = ()=>{
    const {
      device,
      listFollowingTokens
    } = this.state;
    const isWaiting =  _.isNil(listFollowingTokens) || device.isWaiting();
    return (
      <>
        {isWaiting?<Loader /> :(
          <HistoryMined
            onPressWithdraw={async (item)=>{
              await this.handleWithdrawEachToken(item);
              // this.showToastMessage(`OK - ${JSON.stringify(item)}`);
            }}
            listItems={listFollowingTokens}
          />
        )}
      </>
    );

  }

  render() {
    const {
      device,
      loading,
      isFetching
    } = this.state;
    const {navigation} = this.props;
    const isOffline = device?.isOffline()||false;
    const bgTop = device.Type === DEVICES.VIRTUAL_TYPE ?images.bg_top_virtual_device:images.bg_top_device;
    const bgRootTop = device.Type === DEVICES.VIRTUAL_TYPE ?0: images.bg_top_detail;
    return (
      <Container styleContainScreen={{paddingHorizontal:0}} styleRoot={style.container} backgroundTop={{source:bgRootTop,style:[style.imageTop,{backgroundColor:COLORS.blue2}]}}>
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
        <FullLoader loading={loading} />
        <View style={{width: 0,height: 0,display:'none'}}>
          <CreateAccount navigation={navigation} ref={this.viewCreateAccount} />
        </View>
        <ScrollView refreshControl={<RefreshControl refreshing={isFetching} onRefresh={this.onResume} />}>
          {this.renderTop()}
          {this.renderGroupBalance()}
          {/* {this.renderListFollowingTokens()} */}

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

