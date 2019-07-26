import Action from '@src/models/Action';
import ZMQService from 'react-native-zmq-service';
import FirebaseService, { FIREBASE_PASS, MAIL_UID_FORMAT, PHONE_CHANNEL_FORMAT, DEVICE_CHANNEL_FORMAT } from './FirebaseService';

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
}