/* eslint-disable import/no-cycle */
import Action from '@src/models/Action';
import Device from '@src/models/device';
import LocalDatabase from '@src/utils/LocalDatabase';
import Util from '@src/utils/Util';
import _ from 'lodash';
import APIService from './api/miner/APIService';
import FirebaseService, { DEVICE_CHANNEL_FORMAT, FIREBASE_PASS, MAIL_UID_FORMAT, PHONE_CHANNEL_FORMAT } from './FirebaseService';
import { ExHandler } from './exception';

const TAG = 'NodeService';
const password = `${FIREBASE_PASS}`;
const templateAction = {
  key:'',
  data:{}
};
const timeout = 10;
export const LIST_ACTION={
  UPDATE_FIRMWARE:{
    key:'update_firmware',
    data:undefined
  },
  CHECK_VERSION:{
    key:'check_version',
    data:undefined
  },
  GET_IP:{
    key:'ip_address',
    data:undefined
  },
  RESET:{
    key:'factory_reset',
    data:undefined
  },
  CHECK_STATUS:{
    key:'status',
    data:undefined
  },
  START:{
    key:'start',
    data:undefined
  },
  STOP:{
    key:'stop',
    data:undefined
  },
};
export default class NodeService {
  static authFirebase = (product) =>{
    return new Promise((resolve,reject)=>{
      let productId = product.product_id;
      const firebase = new FirebaseService();// FirebaseService.getShareManager();
      let mailProductId = `${productId}${MAIL_UID_FORMAT}`;
      let password = `${FIREBASE_PASS}`;
      firebase.signIn( mailProductId,password).then(uid=>{
        resolve(uid);
      }).catch(e=>{
        reject(e);
      });
    });
    
  }
  static send = (product, actionExcute = templateAction, chain = 'incognito',type = 'incognito',dataToSend={},timeout = 5) => {
    return new Promise((resolve,reject)=>{
      const productId = product.product_id;
      console.log(TAG, 'ProductId: ', product.product_id);
      if (productId) {
        const firebase = new FirebaseService();
        const uid = firebase.getUID()||'';
        const mailProductId = `${productId}${MAIL_UID_FORMAT}`;
        const action = NodeService.buildAction(product,actionExcute,dataToSend,chain,type);
        const callBack = res => {
          const {status = -1,data} = res;
          console.log(TAG,'send Result: ', res);
          if (status >= 0) {
            resolve({...data,productId:productId,uid:uid});
          } else {
            console.log(TAG,'send Timeout action = ' + actionExcute.key);
            reject('Timeout action = '+  actionExcute.key);
          }
        };
        firebase.sendAction(
          mailProductId,
          password,
          action,
          callBack,
          timeout
        );
      }
    });

   
    
  };
  static buildAction =(product,actionExcute = templateAction,data, chain = 'incognito',type = 'incognito')=>{
    const productId = product.product_id || '';
    if (productId) {
      console.log(TAG, 'ProductId: ', product.product_id);  
      const phoneChannel = `${productId}${PHONE_CHANNEL_FORMAT}`;
      const deviceChannel = `${productId}${DEVICE_CHANNEL_FORMAT}`;
      const dataToSend = data||{};
      const action = new Action(
        type,
        phoneChannel,
        { action: actionExcute.key, chain: chain, type: type, ...dataToSend },
        'firebase',
        deviceChannel
      );
      return action;
    }
    return null;
  };

  static reset = async(device:Device,chain='incognito')=>{
    
    try {
      if(!_.isEmpty(device)){
        const actionReset = LIST_ACTION.RESET;
        const dataResult = await Util.excuteWithTimeout(NodeService.send(device.data,actionReset,chain,Action.TYPE.PRODUCT_CONTROL),timeout);
        console.log(TAG,'reset send dataResult = ',dataResult);
        // const { status = -1, data, message= ''} = dataResult;
        return _.isEqual(dataResult?.status,1);
      }
    } catch (error) {
      console.log(TAG,'reset error = ',error);
      return false;
    }

    return false;
  }

  static updateFirware = async(device:Device,chain='incognito')=>{
    
    try {
      if(!_.isEmpty(device)){
        const actionReset = LIST_ACTION.UPDATE_FIRMWARE;
        const dataResult = await Util.excuteWithTimeout(NodeService.send(device.data,actionReset,chain,Action.TYPE.PRODUCT_CONTROL),timeout);
        console.log(TAG,'updateFirware send dataResult = ',dataResult);
        // const { status = -1, data, message= ''} = dataResult;
        return dataResult;
      }
    } catch (error) {
      console.log(TAG,'updateFirware error = ',error);
      return null;
    }

    return null;
  }
  
  static checkVersion = async(device:Device,chain='incognito')=>{
    
    try {
      if(!_.isEmpty(device)){
        const action = LIST_ACTION.CHECK_VERSION;
        const dataResult = await Util.excuteWithTimeout(NodeService.send(device.data,action,chain,Action.TYPE.PRODUCT_CONTROL),8);
        console.log(TAG,'checkVersion send dataResult = ',dataResult);
        const { status = -1, data, message= ''} = dataResult;
        if(status === 1){
          return data;
        }
      }
    } catch (error) {
      console.log(TAG,'checkVersion error = ',error);
    }

    return null;
  }

  static pingGetIP = async(device:Device,chain='incognito')=>{
    
    try {
      if(!_.isEmpty(device)){
        const action = LIST_ACTION.GET_IP;
        const dataResult = await Util.excuteWithTimeout(NodeService.send(device.data,action,chain,Action.TYPE.PRODUCT_CONTROL),8);
        console.log(TAG,'pingGetIP send dataResult = ',dataResult);
        const { status = -1, data, message= ''} = dataResult;
        if(status === 1){
          return data;
        }
      }
    } catch (error) {
      console.log(TAG,'pingGetIP error = ',error);
    }

    return null;
  }

  static sendPrivateKey = async(device:Device,privateKey:String,chain='incognito')=>{
    
    try {
      if(!_.isEmpty(device) && !_.isEmpty(privateKey)){
        const actionPrivateKey = LIST_ACTION.GET_IP;
        const dataResult = await Util.excuteWithTimeout(NodeService.send(device.data,actionPrivateKey,chain,Action.TYPE.PRODUCT_CONTROL),8);
        console.log(TAG,'sendPrivateKey send dataResult = ',dataResult);
        const { status = -1, data, message= ''} = dataResult;
        if(status === 1){
          const action:Action = NodeService.buildAction(device.data,LIST_ACTION.START,{product_id:device.data.product_id, privateKey:privateKey},chain,'incognito');
          const params = {
            type:action?.type||'',
            data:action?.data||{}
          };
          console.log(TAG,'sendPrivateKey send init data = ',params);
          const response = await APIService.sendValidatorKey(data,params);
          const uid = dataResult?.uid||'';
        
          console.log(TAG,'sendPrivateKey send post data = ',response);
          return {...response,uid:uid};
        }
      }
    } catch (error) {
      console.log(TAG,'sendPrivateKey error = ',error);
    }

    return null;
  }

  static sendValidatorKey = async(device:Device,validatorKey:String,chain='incognito')=>{
    
    try {
      if(!_.isEmpty(device) && !_.isEmpty(validatorKey)){
        const actionGetIp = LIST_ACTION.GET_IP;
        const dataResult = await Util.excuteWithTimeout(NodeService.send(device.data,actionGetIp,chain,Action.TYPE.PRODUCT_CONTROL),8);
        console.log(TAG,'sendValidatorKey send dataResult = ',dataResult);
        const { status = -1, data, message= ''} = dataResult;
        if(status === 1){
          const action:Action = NodeService.buildAction(device.data,LIST_ACTION.START,{product_id:device.data.product_id, validatorKey:validatorKey},chain,'incognito');
          const params = {
            type:action?.type||'',
            data:action?.data||{}
          };
          console.log(TAG,'sendValidatorKey send init data = ',params);
          const response = await APIService.sendValidatorKey(data,params);
          const uid = dataResult?.uid||'';
        
          console.log(TAG,'sendValidatorKey send post data = ',response);
          return {...response,uid:uid};
        }
      }
    } catch (error) {
      console.log(TAG,'sendValidatorKey error = ',error);
    }

    return null;
  }

  /***
   * return : {"PaymentAddress","Commission","StakerAddress"}
   */
  static fetchAndSavingInfoNodeStake = async(device:Device,isNeedSaving=false)=>{
    
    try {
      let fetchProductInfo = device.toJSON()??{};
      const paymentAddress =  device.PaymentAddressFromServer;
      
      const resultRequest =  await Util.excuteWithTimeout(APIService.fetchInfoNodeStake({
        PaymentAddress:paymentAddress
      }),5).catch(console.log);
      const dataRequestStake = resultRequest.data||{};
      if( !_.isEmpty(dataRequestStake)){
        fetchProductInfo['minerInfo'] = {
          ...fetchProductInfo.minerInfo,
          ...dataRequestStake
        };
      }
      if(isNeedSaving && !_.isEmpty(fetchProductInfo)){
        await LocalDatabase.updateDevice(fetchProductInfo);
      }

      return fetchProductInfo['minerInfo'];
      
    } catch (error) {
      console.log(TAG,'fetchAndSavingInfoNodeStake error = ',error);
    }

    return null;
  }

  /**
   * {isHave:false,current:0.0,node:0.0}
   */
  static checkUpdatingVersion = async (device:Device)=>{
    let dataResult = {isHave:false,current:undefined,node:undefined};
    try {
      const {data ,status = 0} = await APIService.getSystemPlatform().catch(e=>new ExHandler(e).showWarningToast())??{} ;
      if(!_.isEqual(status,0)){
        const {
          created_at,
          id,
          status = 0,
          version=''
        } = data;
        const nodeVersion = await NodeService.checkVersion(device);
        console.log(TAG,'checkUpdatingVersion nodeVersion ',nodeVersion);
        // compare to node's version
        dataResult = {
          ...dataResult,
          isHave: !_.isEqual(nodeVersion,version),
          current:version,
          node:nodeVersion
        };
        return dataResult;
      }
    } catch (error) {
      console.log(TAG,'checkUpdatingVersion error ',error);
      new ExHandler(error).throw();
    }
    return dataResult;
  }

}