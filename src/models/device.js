import accountService from '@src/services/wallet/accountService';
import _ from 'lodash';

const template = {
  minerInfo:{
    account:{}
  },
  status:{
    code: -1,
    message:'Waiting'
  }
};
export default class Device {
  static CODE_UNKNOWN = -1;
  static CODE_STOP = 4;
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
  static offlineStatus =()=>{
    return {
      code:Device.CODE_OFFLINE,
      message:'offline'
    };
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

  balance = async(account,wallet)=>{
    const result = (!_.isEmpty(account)&& !_.isEmpty(wallet) && await accountService.getBalance(account,wallet))||0;
    return result;
  }
  balanceToken = async(account,wallet,tokenID = '')=>{
    const result = (!_.isEmpty(account) && !_.isEmpty(wallet)  && await accountService.getRewardAmount(tokenID, account,wallet))||0;
    return result;
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
}