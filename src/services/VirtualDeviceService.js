/* eslint-disable import/no-cycle */
import Action from '@src/models/Action';
import _ from 'lodash';
import Util from '@src/utils/Util';
import Device,{DEVICE_STATUS} from '@src/models/device';
import APIService,{METHOD} from './api/miner/APIService';

const TAG = 'VirtualDeviceService';
const DATA_INFO = [ {'status':'offline', 'message':'ready','code':DEVICE_STATUS.CODE_START},
  {'status':'syncing', 'message':'syncing','code':DEVICE_STATUS.CODE_SYNCING},
  {'status':'ready', 'message':'ready','code':DEVICE_STATUS.CODE_START},
  {'status':'mining', 'message':'earning','code':DEVICE_STATUS.CODE_MINING},
  {'status':'pending', 'message':'waiting to be selected','code':DEVICE_STATUS.CODE_PENDING},
  {'status':'notmining', 'message':'ready','code':DEVICE_STATUS.CODE_START}];
const timeout = 8;
export const LIST_ACTION={
  GET_PRIVACY_CUSTOM_TOKEN:{
    key:'listprivacycustomtoken',
    data:{
      'jsonrpc': '1.0',
      'method': 'listprivacycustomtoken',
      'params': [],
      'id': 1
    }
  },
  GET_PUBLIC_KEY_MINING:{
    key:'getpublickeymining',
    data:{
      'jsonrpc': '1.0',
      'method': 'getpublickeymining',
      'params': [],
      'id': 1
    }
  },
  GET_REWARD_AMOUNT:{
    key:'getrewardamount',
    data:{
      'jsonrpc': '1.0',
      'method': 'getrewardamount',
      'params': [''],
      'id':1
    }
  },
  GET_MINING_INFO:{
    key: 'getmininginfo',
    data:{
      'jsonrpc': '1.0',
      'method': 'getmininginfo',
      'params': [],
      'id': 1
    }
  },
  GET_CHAIN_MINING_STATUS:{
    key:'getchainminingstatus',
    data:{
      'jsonrpc': '1.0',
      'method': 'getchainminingstatus',
      'params': [],
      'id': 1
    }  
  }
  
};
export default class VirtualDeviceService {

  static getMininginfo = async(device:Device)=>{
    try {
      let apiURL = VirtualDeviceService.buildURL(device);
      if(!_.isEmpty(apiURL)){
        apiURL = `${apiURL}/${LIST_ACTION.GET_MINING_INFO.key}`;
        const buildParams = LIST_ACTION.GET_MINING_INFO.data;
        const response = await Util.excuteWithTimeout(APIService.getURL(METHOD.POST, apiURL, buildParams, false,false),3);
      
        console.log(TAG,'getMiningInfo result',response);
        return response;
      }
    } catch (error) {
      console.log(TAG,'getMiningInfo error',error);
    }
  }

  static getPublicKeyMining = async(device:Device)=>{
    try {
      let apiURL = VirtualDeviceService.buildURL(device);
      if(!_.isEmpty(apiURL)){
        apiURL = `${apiURL}/${LIST_ACTION.GET_PUBLIC_KEY_MINING.key}`;
        const buildParams = LIST_ACTION.GET_PUBLIC_KEY_MINING.data;
        const response = await Util.excuteWithTimeout(APIService.getURL(METHOD.POST, apiURL, buildParams, false,false),3);
      
        console.log(TAG,'getPublicKeyMining result',response);
        const {Result=''} = response;
        return Result;
      }
    } catch (error) {
      console.log(TAG,'getPublicKeyMining error',error);
    }
    return '';
  }

  /*
  *** is sefl node
  */
  static getPrivacyCustomToken = async(device:Device):Promise<Array>=>{
    try {
      let apiURL = VirtualDeviceService.buildURL(device);
      if(!_.isEmpty(apiURL)){
        apiURL = `${apiURL}/${LIST_ACTION.GET_PRIVACY_CUSTOM_TOKEN.key}`;
        const buildParams = LIST_ACTION.GET_PRIVACY_CUSTOM_TOKEN.data;
        const response = await Util.excuteWithTimeout(APIService.getURL(METHOD.POST, apiURL, buildParams, false,false),3);
      
        console.log(TAG,'getPrivacyCustomToken result',response);
        const {Result={}} = response;
        return Result['ListCustomToken']??[];
      }
    } catch (error) {
      console.log(TAG,'getPrivacyCustomToken error',error);
    }
    return [];
  }

  static getRewardAmount = async(device:Device)=>{
    try {
      let apiURL = VirtualDeviceService.buildURL(device);
      if(!_.isEmpty(apiURL)){
        apiURL = `${apiURL}/${LIST_ACTION.GET_REWARD_AMOUNT.key}`;
        const buildParams = LIST_ACTION.GET_REWARD_AMOUNT.data;
        const response = await Util.excuteWithTimeout(APIService.getURL(METHOD.POST, apiURL, buildParams, false,false),3);
      
        console.log(TAG,'getRewardAmount result',response);
        return response;
      }
    } catch (error) {
      console.log(TAG,'getRewardAmount error',error);
    }
  }

  static getChainMiningStatus = async(device:Device)=>{
    let dataResponseCombinded = {'status': Device.offlineStatus()};
    try {
      let dataResult = await VirtualDeviceService.getMininginfo(device).catch(err=>{
        console.log(TAG,'getChainMiningStatus getMininginfo error');
      })||{};
      const shardID = dataResult.Result?.ShardID ?? undefined;

      let apiURL = VirtualDeviceService.buildURL(device);
      
      console.log(TAG,'getChainMiningStatus begin shardID - ',shardID);
      if(!_.isEmpty(apiURL) && !_.isNil(shardID)){
        apiURL = `${apiURL}/${LIST_ACTION.GET_CHAIN_MINING_STATUS.key}`;
        const buildParams = {
          ...LIST_ACTION.GET_CHAIN_MINING_STATUS.data,
          'params': [shardID]
        };
        const response = await Util.excuteWithTimeout(APIService.getURL(METHOD.POST, apiURL, buildParams, false,false),3);
        
        const {Result ,Method} = response ?? {};
        const item = DATA_INFO.find((item)=>{
          return _.isEqual(Result,item.status);
        })|| Device.offlineStatus();
        dataResponseCombinded = {'status': {'code': item.code ,'message':item.message }};
        console.log(TAG,'getChainMiningStatus result',response);
        return {status:1, data:dataResponseCombinded,productId:device.ProductId};
      }
    } catch (error) {
      console.log(TAG,'getChainMiningStatus error',error);
      return {status:-1, data:dataResponseCombinded};
    }
  }

  static buildURL=(device:Device)=>{
    return !_.isEmpty(device?.APIUrl) ?`http://${device.APIUrl}`:'';
  }
}