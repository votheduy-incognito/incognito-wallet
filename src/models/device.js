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
export const DATA_INFO = [ {'status':'offline', 'message':'ready','code':DEVICE_STATUS.CODE_START},
  {'status':'syncing', 'message':'syncing','code':DEVICE_STATUS.CODE_SYNCING},
  {'status':'ready', 'message':'ready','code':DEVICE_STATUS.CODE_START},
  {'status':'mining', 'message':'earning','code':DEVICE_STATUS.CODE_MINING},
  {'status':'pending', 'message':'waiting to be selected','code':DEVICE_STATUS.CODE_PENDING},
  {'status':'notmining', 'message':'ready','code':DEVICE_STATUS.CODE_START}];
export const template = {
  minerInfo:{
    account:{},
    isCallStaked:false
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
  constructor(data:template){
    this.data = {...template, ...data};
  }
  isStartedChain=()=>{
    return this.data.status.code!=Device.CODE_OFFLINE && this.data.status.code!=Device.CODE_UNKNOWN && this.data.status.code !== Device.CODE_STOP;
  }
  isOffline =()=>{
    return this.data.status.code == Device.CODE_OFFLINE || (this.data.status.code == Device.CODE_UNKNOWN && this.data.status.message !== template.status.message);
  }
  isEarning =()=>{
    return this.data.status.code == Device.CODE_MINING;
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
    const apiURL = !_.isEmpty(this.Host) && !_.isEmpty(this.Port)? `${this.Host}:${this.Port}`:'';
    return apiURL;
  }
  set Status(status:{}){
    this.data.status = status;
  }

  get Status(){
    return  this.data.status||template.status;
  }

  get Name(){
    return this.data.product_name||'';
  }
  get Type(){
    return this.data.product_type||'';
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
    const result = (!_.isEmpty(accountName) && !_.isEmpty(wallet)  && await accountService.getRewardAmount(tokenID, accountName,wallet))||0;
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
  
  toJSON(){
    return this.data;
  }
  statusMessage =()=>{
    return this.data.status?.message||'';
  }
  static getInstance = (data=template):Device =>{
    return new Device(data);
  }
  static getRewardAmount = async (deviceInfo:Device,wallet?)=>{
    let balance = 0;
    if(!_.isEmpty(deviceInfo)){
      switch(deviceInfo.Type){
      case DEVICES.VIRTUAL_TYPE:{
        let dataResult = await VirtualDeviceService.getRewardFromMiningkey(deviceInfo) ?? {};
        
        const {Result={}} = dataResult;
        balance = Result['PRV']??0;
        
        break;
      }
      default:{
        balance = await deviceInfo.balanceToken(null,wallet);
      }
      } 
    }
    
    balance = _.isNaN(balance)?0:balance;
    console.log(TAG,'getRewardAmount balance = ',balance);
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