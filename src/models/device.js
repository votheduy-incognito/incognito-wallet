
import { DEVICES } from '@src/constants/miner';
import accountService from '@src/services/wallet/accountService';
import LocalDatabase from '@utils/LocalDatabase';
import _ from 'lodash';

export const DEVICE_STATUS = {
  CODE_UNKNOWN : -1,
  CODE_STOP : 4,
  CODE_PENDING : 5,
  // CODE_OUT_OF_STATUS : -3,
  CODE_START : 2,
  CODE_MINING : 3,
  CODE_SYNCING : 1,
  CODE_OFFLINE : -2
};
export const DATA_INFO = [{'status':'ready', 'message':'online','code':DEVICE_STATUS.CODE_START},
  {'status':'syncing', 'message':'syncing','code':DEVICE_STATUS.CODE_SYNCING},
  {'status':'mining', 'message':'earning','code':DEVICE_STATUS.CODE_MINING},
  {'status':'offline', 'message':__DEV__?'offline_online':'online','code':DEVICE_STATUS.CODE_START},
  {'status':'pending', 'message':'processing','code':DEVICE_STATUS.CODE_PENDING},
  {'status':'notmining', 'message':__DEV__?'notmining_online':'online','code':DEVICE_STATUS.CODE_START},
  {'status':'waiting', 'message':__DEV__?'waiting_earning':'earning','code':DEVICE_STATUS.CODE_MINING}];
export const template = {
  minerInfo:{
    account:{},
    isCallStaked:false,
    qrCodeDeviceId:'',
    PaymentAddress:'',
    StakerAddress:'',
    Commission:1
  },
  keyInfo:{
    publicKeyMining:'',
    publicKeyRole:''

  },
  status:{
    code: -1,
    message:'Waiting'
  },
  is_checkin: 0,
  platform: 'MINER',
  product_id: '',
  product_name: 'Miner',
  verify_code:'',
  user_id:-1,
  deleted:false,

  product_type:DEVICES.MINER_TYPE
};
const TAG = 'Device';
export default class Device {
  static CODE_UNKNOWN = DEVICE_STATUS.CODE_UNKNOWN;
  static CODE_STOP = DEVICE_STATUS.CODE_STOP;
  static CODE_PENDING = DEVICE_STATUS.CODE_PENDING;
  static CODE_START = DEVICE_STATUS.CODE_START;
  static CODE_MINING = DEVICE_STATUS.CODE_MINING;
  static CODE_SYNCING = DEVICE_STATUS.CODE_SYNCING;
  static CODE_OFFLINE = DEVICE_STATUS.CODE_OFFLINE;

  //  SYNCING = 1
  // READY   = 2
  // MINING  = 3
  // STOP    = 4
  constructor(data){
    this.data = {...template, ...data,status:template.status};
  }
  isStartedChain=()=>{
    return this.data.status.code!=Device.CODE_OFFLINE && this.data.status.code!=Device.CODE_UNKNOWN && this.data.status.code !== Device.CODE_STOP;
  }
  isOffline =()=>{
    return this.data.status.code == Device.CODE_OFFLINE || (this.data.status.code == Device.CODE_UNKNOWN && this.data.status.message !== template.status.message);
  }
  isWaiting =()=>{
    return this.data.status.message === template.status.message;
  }
  isEarning =()=>{
    return this.data.status.code == Device.CODE_MINING;
  }
  isSyncing =()=>{
    return this.data.status.code == Device.CODE_SYNCING;
  }
  isReady =()=>{
    return this.data.status.code == Device.CODE_START;
  }
  accountName = () =>{
    return this.data.minerInfo?.account?.name||this.Name;
  }
  get isCallStaked(){
    return this.data.minerInfo?.isCallStaked||false;
  }
  get PublicKeyMining(){
    return this.data.keyInfo?.publicKeyMining;
  }
  set PublicKeyMining(publicKeyMining:String){
    const keyInfo = {
      ...this.data.keyInfo,
      publicKeyMining:publicKeyMining
    };
    this.data['keyInfo'] = keyInfo;
  }
  get PublicKeyRole(){
    return this.data.keyInfo?.publicKeyRole;
  }
  set PublicKeyRole(publicKeyRole:String){
    const keyInfo = {
      ...this.data.keyInfo,
      publicKeyRole:publicKeyRole
    };
    this.data['keyInfo'] = keyInfo;
  }
  static offlineStatus =()=>{
    return {
      code:Device.CODE_OFFLINE,
      message:'offline'
    };
  }
  static outOfStatus =(statusMessage?)=>{
    const status = DATA_INFO[0];
    return {
      ...status,
      'message':__DEV__?`${statusMessage}_online`:'online'
    };
  }
  get Host(){
    return this.data.minerInfo?.ipAddress||'';
  }
  get Port(){
    return this.data.minerInfo?.port||'';
  }

  get APIUrl(){
    if (!_.isEmpty(this.Host) && _.isEmpty(this.Port)) {
      return this.Host;
    }

    return !_.isEmpty(this.Host) && !_.isEmpty(this.Port) ? `${this.Host}:${this.Port}` : '';
  }
  set Status(status:{}){
    // const item = DATA_INFO.find((i)=>{
    //   return _.isEqual(i.code,status.code) && (_.isEqual(i.status,status.message)||_.isEqual(i.status,status.status)) ;
    // })|| Device.offlineStatus();
    // const dataResponseCombinded =  {'code': item.code ,'message':item.message };
    this.data.status = status;
  }

  get Status(){
    let status = this.data.status;
    // if(this.Type != DEVICES.VIRTUAL_TYPE){
    //   const item = DATA_INFO.find((i)=>{
    //     return _.isEqual(i.code,status.code) &&  (_.isEqual(i.status,status.message));
    //   })|| Device.offlineStatus();
    //   status =  {'code': item.code ,'message':item.message };
    // }
    return  status||template.status;
  }

  get Name(){
    return this.data.product_name || '';
  }
  get Type(){
    return this.data.product_type || '';
  }

  balance = async(account,wallet)=>{
    const result = (!_.isEmpty(account)&& !_.isEmpty(wallet) && await accountService.getBalance(account,wallet))||0;
    return result;
  }

  saveAccount = async (account)=>{
    if(!_.isEmpty(account)){
      let listLocalDevice = await LocalDatabase.getListDevices();
      this.data.minerInfo['account'] = {
        ...account
      };
      const index = listLocalDevice.findIndex(item=> _.isEqual(item?.product_id,this.data.product_id));
      listLocalDevice[index] = this.data;
      await LocalDatabase.saveListDevices(listLocalDevice);
      return true;
    }
    return false;
  }

  requestWithdraw = async(account,wallet,tokenID )=>{
    const result = (!_.isNil(tokenID) && !_.isEmpty(account)&& !_.isEmpty(wallet) && await accountService.createAndSendWithdrawRewardTx(tokenID, account,wallet).catch(console.log))??null;
    return result;
  }

  get ProductId(){
    return this.data.product_id ?? '';
  }

  get qrCodeDeviceId(){
    return this.data.minerInfo?.qrCodeDeviceId ?? '';
  }

  get StakerAddressFromServer(){
    return this.data.minerInfo?.StakerAddress ?? '';
  }

  get PaymentAddressFromServer(){
    return this.data.minerInfo?.PaymentAddress ?? '';
  }

  get CommissionFromServer(){
    return this.data.minerInfo?.Commission ?? 1;
  }

  toJSON(){
    return this.data;
  }
  statusMessage =()=>{
    let status = this.data.status;
    if(this.Type != DEVICES.VIRTUAL_TYPE){
      if(status.code == template.status.code){
        return template.status.message;
      }
      const item = DATA_INFO.find((i)=>{
        return _.isEqual(i.code,status.code);
      })|| Device.offlineStatus();
      status =  {'code': item.code ,'message':item.message};
    }
    return status.message||'';
  }
  static getInstance = (data=template):Device =>{
    return new Device(data);
  }
  
}
