import Action from '@src/models/Action';
import _ from 'lodash';
import Util from '@src/utils/Util';
import Device from '@src/models/device';
import APIService,{METHOD} from './api/miner/APIService';

const TAG = 'VirtualDeviceService';
const password = 'kkkk';

const timeout = 8;
export const LIST_ACTION={
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
        if (_.isEqual(Result,'syncing')){
          dataResponseCombinded = {'status': {'code': Device.CODE_SYNCING ,'message':'syncing' }};
        }else if (_.isEqual(Result,'ready')){
          dataResponseCombinded = {'status': {'code': Device.CODE_START ,'message':'ready' }};
        } else if (_.isEqual(Result,'mining')){
          dataResponseCombinded = {'status': {'code': Device.CODE_MINING ,'message':'mining' }};
        } else if (_.isEqual(Result,'offline')){
          dataResponseCombinded = {'status': {'code': Device.CODE_START ,'message':'ready' }};
        }
      
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