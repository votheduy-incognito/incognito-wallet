import accountService from '@src/services/wallet/accountService';
import _ from 'lodash';
import { DEVICES } from '@src/constants/miner';

export const template = {
  minerInfo:{
    account:{}
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
export default class Device {
  static CODE_UNKNOWN = -1;
  static CODE_STOP = 4;
  static CODE_PENDING = 5;
  static CODE_START = 2;
  static CODE_MINING = 3;
  static CODE_SYNCING = 1;
  static CODE_OFFLINE = -2;

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
    return this.data.status.code == Device.CODE_OFFLINE || this.data.status.code == Device.CODE_UNKNOWN;
  }
  accountName = () =>{
    return this.data.minerInfo?.account?.name||this.Name;
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

  balance = async(account,wallet)=>{
    const result = (!_.isEmpty(account)&& !_.isEmpty(wallet) && await accountService.getBalance(account,wallet))||0;
    return result;
  }
  balanceToken = async(account,wallet,tokenID = '')=>{
    const result = (!_.isEmpty(account) && !_.isEmpty(wallet)  && await accountService.getRewardAmount(tokenID, account,wallet))||0;
    return result;
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