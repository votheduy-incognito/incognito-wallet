import Action from '@src/models/Action';
import FirebaseService, { FIREBASE_PASS, MAIL_UID_FORMAT, PHONE_CHANNEL_FORMAT, DEVICE_CHANNEL_FORMAT } from './FirebaseService';

const TAG = 'DeviceService';
const password = `${FIREBASE_PASS}`;
const templateAction = {
  key:'',
  data:{}
};
export const LIST_ACTION={
  CHECK_STATUS:{
    key:'status',
    data:undefined
  } 
};
export default class DeviceService {
  static send = async (product, actionExcute = templateAction, chain = 'incognito',timeout = 5) => {
    return await new Promise((resolve,reject)=>{
      const productId = product.product_id;
      console.log(TAG, 'ProductId: ', product.product_id);
      if (productId) {
        const firebase = FirebaseService.getShareManager();
        const mailProductId = `${productId}${MAIL_UID_FORMAT}`;
        const phoneChannel = `${productId}${PHONE_CHANNEL_FORMAT}`;
        const deviceChannel = `${productId}${DEVICE_CHANNEL_FORMAT}`;
        const action = new Action(
          chain,
          phoneChannel,
          { action: actionExcute.key, chain: chain, type: '', privateKey: '' },
          'firebase',
          deviceChannel
        );
        const callBack = res => {
          console.log(TAG,'Result: ', res);
          if (res) {
            const data = res.data || {};
            resolve({...data,productId:productId});
          } else {
            console.log('Timeout check wifi');
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
}