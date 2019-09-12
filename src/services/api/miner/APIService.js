/**
 * @providesModule APIService
 */
import User from '@models/user';
import { CONSTANT_MINER } from '@src/constants';
import LocalDatabase from '@utils/LocalDatabase';
import _ from 'lodash';
import { NetInfo } from 'react-native';
import API from './api';

let AUTHORIZATION_FORMAT = 'Autonomous';
export const METHOD = {
  POST: 'post',
  GET: 'get',
  PUT: 'PUT',
  DELETE: 'delete'
};
const TAG = 'APIService';
export default class APIService {
  static buildUrl(url, parameters) {
    let qs = '';
    for (const key in parameters) {
      const value = parameters[key];
      qs += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
    }
    if (qs.length > 0) {
      qs = qs.substring(0, qs.length - 1); // chop off last "&"
      url = `${url}?${qs}`;
    }
    return url;
  }
  
  static async getURL(method, url, params, isLogin,isBuildFormData = true) {
    
    console.log(TAG,'getURL :', url);
    // console.log(TAG,'getURL Params:', params);
    let header = {};
    let user = {};
    const isConnected = await NetInfo.isConnected.fetch();
    // console.log('isConnected==>', isConnected); 
    if (!isConnected){
      return {status: 0, data: {message:'Internet is offline'}} ;

    }

    if (isLogin){
      const userObject:User = await LocalDatabase.getUserInfo();
      user = userObject?.data||{};
      const token = user.token;
      console.log(TAG,'getURL token',token);
      header= {
        'Authorization': `${AUTHORIZATION_FORMAT} ${token}`
      };
    }
    if (method === METHOD.GET) {
      try {
        const URL = APIService.buildUrl(url, params);
        console.log('URL build :', URL);
        const res = await fetch(URL, {
          method,
          // credentials: 'include',
          headers: header
        });

        // console.log(TAG,'getURL Header: ', header);
        // console.log(TAG,'getURL Res:', res);
        // if (!res.ok) {
        //   // throw new Error(res.statusText);
        //   return {status: 0, data: ''};
        // }
        if (res && res.error){
          //throw new Error(res.error);
          return {status: 0, data: ''} ;
        }
        if (res.status == 200){
          const resJson = await res.json();
          // console.log(TAG,'getURL Response data:', resJson);
          return resJson;
        }else if (res.status == 401){

          let response = await APIService.handleRefreshToken(method, url, params, isLogin, user);
          return response;
        }else {
          return {status: 0, data: ''} ;

        }


      } catch (error) {
        console.error(error);
        throw error;
        //return {status: 0, error: error.message} ;
      }
    } else if (method === METHOD.POST || method === METHOD.PUT) {
      
      try {
        header = {
          ...header,
          Accept:'application/json'
        };
        // header['Accept'] = 'application/json';
        let formData = JSON.stringify(params);
        if(isBuildFormData){
          formData = new FormData();
          var isUpload = false;
          for (var k in params) {

            if (k == 'image' || k== 'image_file'){
              isUpload = true;
              //const isExist = await APIService.isExist(params[k])
              //console.log('File exist:', isExist)
              var photo = {
                uri: params[k],
                type: 'image/jpeg',
                name: 'photo.jpg',
              };
              formData.append(k, photo);
            }else {
              formData.append(k, params[k]);

            }

          //formData.append(k, params[k]);
          }
          console.log('Form data: ', formData);
          header['Content-Type'] = 'multipart/form-data';
          
        }else{
          header['Content-Type'] = 'application/json';
          
        }
        
        const res = await fetch(url, {
          method: method,
          headers: header,
          body:formData
        });
        // console.log('Response:', res);
        // console.log('Header: ', header);
        // console.log('Resonse Status:', res.status);
        if (res && res.error){
          //throw new Error(res.error);
          return {status: 0, data: ''} ;
        }
        if (res.status == 200){
          const resJson = await res.json();
          console.log('Response data:', resJson);
          return resJson;
        }else if (res.status == 401){

          let response = await APIService.handleRefreshToken(method, url, params, isLogin, user);
          return response;
        }else {
          return {status: 0, data: ''} ;

        }


      } catch (error) {
        console.log('Error: ',error);
        return {status: 0, error: error.message} ;

      }
    } else if (method === METHOD.DELETE) {
      try {
        const URL = APIService.buildUrl(url, params);
        const res = await fetch(URL, {
          method: 'delete',
          credentials: 'include',
          headers: header
        });
        console.log('Header: ', header);
        if (res && res.error){
          //throw new Error(res.error);
          return {status: 0, data: ''} ;
        }
        if (res.status == 200){
          const resJson = await res.json();
          console.log('Response data:', resJson);
          return resJson;
        }else if (res.status == 401){

          let response = await APIService.handleRefreshToken(method, url, params, isLogin, user);
          return response;
        }else {
          return {status: 0, data: ''} ;

        }
      } catch (error) {
        console.error(error);
        return {status: 0, error: error.message} ;

      }
    }
  }
  static async handleRefreshToken(method, url, params, isLogin, user){
    console.log('handleRefreshToken');
    console.log('User:', user);
    const header= {
      'Authorization': `${AUTHORIZATION_FORMAT} ${user.refresh_token}`
    };
    let URL = API.REFRESH_TOKEN_API;
    console.log('URL build :', URL);
    try{
      const res = await fetch(URL, {
        method: 'POST',
        credentials: 'include',
        headers: header
      });
      console.log('Header:', header);
      if (res && res.error){
        //throw new Error(res.error);
        return {status: 0, data: ''} ;
      }
      if (res.status == 200){
        const resJson = await res.json();
        console.log('Response data:', resJson);
        const { status, data } = resJson;
        if (status){
          const {token} = data;
          user.token = token;
        
          let response =  await APIService.getURL(method, url, params, isLogin);
  
          return response;
        }else {
          return null;
        }
        
      }else if (res.status == 401){
        return APIService.handleRefreshToken(user);
      }
    }catch(error){
      console.log('Error:', error);
      return null;
    }
    
  }
  static async signIn(params) {
    const url = API.SIGN_IN_API;
    const response = await APIService.getURL(METHOD.POST, url, params, false);
    return response;
  }
  static async sendPrivateKey(ipAdrress,{type,data}) {
    if(!_.isEmpty(data)){
      const url = `http://${ipAdrress}:5000/init-node`;
      const buildParams = {
        'type': type,
        'source': '_PHONE',
        'data': {
          'action': data.action,
          'chain': data.chain,
          'product_id': data.product_id,
          'privateKey': data.privateKey
        },
        'protocal': 'firebase'
      };

      const response = await APIService.getURL(METHOD.POST, url, buildParams, false,false);
      console.log(TAG,'sendPrivateKey:', response);
      return response;
    }
    return null;
  }
  
  static async signUp(params) {
    const url = API.SIGN_UP_API;
    const response = await APIService.getURL(METHOD.POST, url, params, false);
    return response;
  }
  
  static async refreshToken(params) {
    const url = API.REFRESH_TOKEN_API;
    const response = await APIService.getURL(METHOD.POST, url, params, false);
    return response;
  }
  static async signOut() {
    const url = API.SIGN_OUT_API;
    const response = await APIService.getURL(METHOD.DELETE, url, {});
    return response;
  }
  static async getUserProfile() {
    const url = API.GET_PROFILE_API;
    const response = await APIService.getURL(METHOD.GET, url, {});
    return response;
  }
  
  static async verifyCode(params) {
    const url = API.VERIFY_CODE_API;

    const response = await APIService.getURL(METHOD.GET, url, params, true);
    return response;
  }
  
  static async removeProduct(params) {
    const url = API.REMOVE_PRODUCT_API;

    const response = await APIService.getURL(METHOD.DELETE, url, params, true);
    return response;
  }
  static async updateProduct(params) {
    const url = API.UPDATE_PRODUCT_API;

    const response = await APIService.getURL(METHOD.PUT, url, params, true);
    return response;
  }
  static async getSystemPlatform() {
    const url = API.GET_SYSTEM_APP_API;

    const response = await APIService.getURL(METHOD.GET, url, {}, true);
    return response;
  }
  
  static async getProductList(isNeedFilter = false) {
    const url = API.PRODUCT_LIST_API;

    const response = await APIService.getURL(METHOD.GET, url, {}, true);
    let { status, data = [] } = response;
    if (isNeedFilter && status === 1) {
      data  = data.filter(item =>{
        return _.includes(item.platform, CONSTANT_MINER.PRODUCT_TYPE)&& item.is_checkin == 1;
      });
    }
    return {status,data};
  }
  
}
