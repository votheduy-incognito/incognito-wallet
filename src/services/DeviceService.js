import Action from '@src/models/Action';
import Device from '@src/models/device';
import Util from '@src/utils/Util';
import _ from 'lodash';
import APIService from './api/miner/APIService';
import FirebaseService, { DEVICE_CHANNEL_FORMAT, FIREBASE_PASS, MAIL_UID_FORMAT, PHONE_CHANNEL_FORMAT } from './FirebaseService';

const TAG = 'DeviceService';
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
export default class DeviceService {
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
    //   firebase.auth(
    //     mailProductId,
    //     password,
    //     uid => {
    //       resolve(uid);
    //       console.log(TAG,'authFirebase successfully: ', uid);
    //     },
    //     error => {
    //       reject(error);
    //       console.log(TAG,'authFirebase error: ', error);
    //     }
    //   );
    });
    
  }
  static send = (product, actionExcute = templateAction, chain = 'incognito',type = 'incognito',dataToSend={},timeout = 5) => {
    return new Promise((resolve,reject)=>{
      const productId = product.product_id;
      console.log(TAG, 'ProductId: ', product.product_id);
      if (productId) {
        const firebase = new FirebaseService();//FirebaseService.getShareManager();
        const mailProductId = `${productId}${MAIL_UID_FORMAT}`;
        const action = DeviceService.buildAction(product,actionExcute,dataToSend,chain,type);
        const callBack = res => {
          const {status = -1,data} = res;
          console.log(TAG,'send Result: ', res);
          if (status >= 0) {
            resolve({...data,productId:productId});
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
        const dataResult = await Util.excuteWithTimeout(DeviceService.send(device.data,actionReset,chain,Action.TYPE.PRODUCT_CONTROL),timeout);
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
        const dataResult = await Util.excuteWithTimeout(DeviceService.send(device.data,actionReset,chain,Action.TYPE.PRODUCT_CONTROL),timeout);
        console.log(TAG,'updateFirware send dataResult = ',dataResult);
        // const { status = -1, data, message= ''} = dataResult;
        return dataResult;
      }
    } catch (error) {
      console.log(TAG,'reset error = ',error);
      return null;
    }

    return null;
  }
  

  static pingGetIP = async(device:Device,chain='incognito')=>{
    
    try {
      if(!_.isEmpty(device)){
        const action = LIST_ACTION.GET_IP;
        const dataResult = await Util.excuteWithTimeout(DeviceService.send(device.data,action,chain,Action.TYPE.PRODUCT_CONTROL),8);
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
        const dataResult = await Util.excuteWithTimeout(DeviceService.send(device.data,actionPrivateKey,chain,Action.TYPE.PRODUCT_CONTROL),8);
        console.log(TAG,'sendPrivateKey send dataResult = ',dataResult);
        const { status = -1, data, message= ''} = dataResult;
        if(status === 1){
          const action:Action = DeviceService.buildAction(device.data,LIST_ACTION.START,{product_id:device.data.product_id, privateKey:privateKey},chain,'incognito');
          const params = {
            type:action?.type||'',
            data:action?.data||{}
          };
          console.log(TAG,'sendPrivateKey send init data = ',params);
          const response = await APIService.sendPrivateKey(data,params);
        
          console.log(TAG,'sendPrivateKey send post data = ',response);
          return response;
        }
      }
    } catch (error) {
      console.log(TAG,'sendPrivateKey error = ',error);
    }

    return null;
  }
}