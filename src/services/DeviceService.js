import Action from '@src/models/Action';
import ZMQService from 'react-native-zmq-service';
import _ from 'lodash';
import Util from '@src/utils/Util';
import Device from '@src/models/device';
import FirebaseService, { FIREBASE_PASS, MAIL_UID_FORMAT, PHONE_CHANNEL_FORMAT, DEVICE_CHANNEL_FORMAT } from './FirebaseService';
import APIService from './api/miner/APIService';

const TAG = 'DeviceService';
const password = `${FIREBASE_PASS}`;
const templateAction = {
  key:'',
  data:{}
};
export const LIST_ACTION={
  GET_IP:{
    key:'ip_address',
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
  static send = async (product, actionExcute = templateAction, chain = 'incognito',type = 'incognito',dataToSend={},timeout = 5) => {
    return await new Promise((resolve,reject)=>{
      const productId = product.product_id;
      console.log(TAG, 'ProductId: ', product.product_id);
      if (productId) {
        const firebase = FirebaseService.getShareManager();
        const mailProductId = `${productId}${MAIL_UID_FORMAT}`;
        const action = DeviceService.buildAction(product,actionExcute,dataToSend,chain,type);
        const callBack = res => {
          console.log(TAG,'send Result: ', res);
          if (res) {
            const data = res.data || {};
            resolve({...data,productId:productId});
          } else {
            console.log(TAG,'Timeout check wifi');
            reject('Timeout');
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

  static receiveDataFromAddress= ()=>{
    // ZMQService.receiveDataFromAddress('HINETONN', '111111').then(res => {
    //   console.log(TAG,'receiveDataFromAddress successfully res',res);
    // });
  }

  static sendPrivateKey = async(device:Device,chain='incognito')=>{
    
    try {
      if(!_.isEmpty(device)){
        const actionPrivateKey = LIST_ACTION.GET_IP;
        const dataResult = await Util.excuteWithTimeout(DeviceService.send(device.data,actionPrivateKey,chain,Action.TYPE.PRODUCT_CONTROL),8);
        console.log(TAG,'sendPrivateKey send dataResult = ',dataResult);
        const { status = -1, data, message= ''} = dataResult;
        if(status === 1){
          const action:Action = DeviceService.buildAction(device.data,LIST_ACTION.START,{product_id:device.data.product_id, privateKey:'112t8rnX3rRvnpiSCBuA9ES9mzauoyoXXYkZmTqdQd7zfw3QVVFisFmouQ2JQJK1prdkaBaDWaiTtkzgfAkbUTPyXsgGkuJEBUtrE9vrMqhr'},chain,'incognito');
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