/* eslint-disable import/no-cycle */
import common from '@src/constants/common';
import { DEVICES } from '@src/constants/miner';
import VirtualDeviceService from '@src/services/VirtualDeviceService';
import accountService from '@src/services/wallet/accountService';
import format from '@src/utils/format';
import LocalDatabase from '@utils/LocalDatabase';
import _ from 'lodash';

export const DEVICE_STATUS = {
  CODE_UNKNOWN : -1,
  CODE_STOP : 4,
  CODE_PENDING : 5,
  CODE_START : 2,
  CODE_MINING : 3,
  CODE_SYNCING : 1,
  CODE_OFFLINE : -2
};
export const DATA_INFO = [{'status':'ready', 'message':'online','code':DEVICE_STATUS.CODE_START},
  {'status':'syncing', 'message':'syncing','code':DEVICE_STATUS.CODE_SYNCING},
  {'status':'mining', 'message':'earning','code':DEVICE_STATUS.CODE_MINING},
  {'status':'offline', 'message':__DEV__?'offline_online':'online','code':DEVICE_STATUS.CODE_START},
  {'status':'pending', 'message':'queueing','code':DEVICE_STATUS.CODE_PENDING},
  {'status':'notmining', 'message':__DEV__?'notmining_online':'online','code':DEVICE_STATUS.CODE_START}];
export const template = {
  minerInfo:{
    account:{},
    isCallStaked:false,
    qrCodeDeviceId:'',
    PaymentAddress:'',
    Commission:1
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
  static offlineStatus =()=>{
    return {
      code:Device.CODE_OFFLINE,
      message:'offline'
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

  // getPublicKey= async ()=>{
  //   if(this.Type == DEVICES.VIRTUAL_TYPE){
  //     const dataResult = await VirtualDeviceService.getPublicKeyMining(this) ?? {};
  //     const {Result=''} = dataResult;
  //     return Result;
  //   }
  //   return '';
  // }

  balance = async(account,wallet)=>{
    const result = (!_.isEmpty(account)&& !_.isEmpty(wallet) && await accountService.getBalance(account,wallet))||0;
    return result;
  }
  balanceToken = async(account,wallet,tokenID = '')=>{
    const accountName = !_.isEmpty(account)? account.name:this.accountName();
    const result = (!_.isEmpty(accountName) && !_.isEmpty(wallet)  && await accountService.getRewardAmount(tokenID, accountName,wallet))||null;
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

  requestWithdraw = async(account,wallet,tokenID = '')=>{
    const result = (!_.isEmpty(account)&& !_.isEmpty(wallet) && await accountService.createAndSendWithdrawRewardTx(tokenID, account,wallet))|| null;
    return result;
  }

  get ProductId(){
    return this.data.product_id ?? '';
  }

  get qrCodeDeviceId(){
    return this.data.minerInfo?.qrCodeDeviceId ?? '';
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
      const item = DATA_INFO.find((i)=>{
        return _.isEqual(i.code,status.code);
      })|| template.status;
      status =  {'code': item.code ,'message':item.message};
    }
    return status.message||'';
  }
  static getInstance = (data=template):Device =>{
    return new Device(data);
  }
  /*
  balance : null -> node die,
  -1: full-node die
  */
  static getRewardAmount = async (deviceInfo:Device,wallet?)=>{
    let balance = null;
    if(!_.isEmpty(deviceInfo)){
      switch(deviceInfo.Type){
      case DEVICES.VIRTUAL_TYPE:{
        console.log(TAG,'getRewardAmount VIRTUAL_TYPE begin');
        let dataResult = await VirtualDeviceService.getRewardFromMiningkey(deviceInfo);
        
        balance = _.isNil(dataResult)?-1: (dataResult.Result['PRV']||null);
        console.log(TAG,'getRewardAmount VIRTUAL_TYPE dataResult = ',dataResult,deviceInfo.Name,balance);
        break;
      }
      default:{
        balance = await deviceInfo.balanceToken(null,wallet);
      }
      } 
    }
    
    balance = _.isNil(balance)||_.isNaN(balance)?null:balance;
    console.log(TAG,'getRewardAmount balance = ',balance,deviceInfo.Name);
    return balance;
  }
  static formatForDisplayBalance = (balance:Number)=>{
    return format.amount(_.isNaN(balance)?0:balance,common.DECIMALS['PRV']);

  }
  static getStyleStatus = (code)=>{
    let styleStatus = {color:'#91A4A6'};
    if(code === Device.CODE_STOP){
      styleStatus.color = '#91A4A6';
    }else if(code === Device.CODE_MINING){
      styleStatus.color = '#0DB8D8';
    }else if(code === Device.CODE_SYNCING){
      styleStatus.color = '#262727';
    }else if(code === Device.CODE_START){
      styleStatus.color = '#26C64D';
    }
    return styleStatus;
  }
}