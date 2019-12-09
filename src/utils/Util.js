/**
 * @providesModule Util
 */
import _ from 'lodash';
import { Linking } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import { CustomError } from '@src/services/exception';
import knownCode from '@src/services/exception/customError/code/knownCode';
// import timer from 'react-native-timer';
const timer = require('react-native-timer');

const chars = 'abcdefghijklmnopqrstufwxyzABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890';
const TAG = 'Util';
export default class Util {
  static getIconLinkWithSymbol=(symbol = '')=>{
    return `./node_modules/cryptocurrency-icons/32@2x/color/${_.toLower(symbol)}@2x.png`;
  }
  static resetRoute = (navigation, routeName, params = {}) => {
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName, params })]
    });

    navigation.dispatch(resetAction);
  };
  static hashCode = str => {
    return str
      .split('')
      .reduce(
        (prevHash, currVal) =>
          ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
        0
      );
  };

  static openSetting = async (
    sessionName = '',
    isOpenSettingDefault = true
  ) => {
    try {
      const isSupported = await Linking.canOpenURL(
        `app-settings://${sessionName}`
      );
      if (isSupported) {
        Linking.openURL(`app-settings://${sessionName}`);
      } else if (isOpenSettingDefault) {
        Linking.openURL('app-settings:');
      }
      return Promise.resolve(isSupported);
    } catch (error) {
      return Promise.reject('error');
    }
  };

  static currentDateString = (): String => {
    try {
      let today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();

      today = `${mm}/${dd}/${yyyy}`;
      return today;
    } catch (error) {
      console.log(TAG, ' currentDateString error');
    }
    return '';
  };

  static delay = timeSecond =>
    new Promise(res => setTimeout(() => res(), timeSecond * 1000));

  static makeCancelable = promise => {
    let rejectFn;

    const wrappedPromise = new Promise((resolve, reject) => {
      rejectFn = reject;

      Promise.resolve(promise)
        .then(resolve)
        .catch(reject);
    });

    wrappedPromise.cancel = () => {
      rejectFn({ canceled: true });
    };

    return wrappedPromise;
  };
  static isEmailValid(email) {
    // eslint-disable-next-line no-useless-escape
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
  }

  static timeout = (fn, timeSecond = 1) => {
    return new Promise(resolve => {
      setTimeout(() => resolve(fn), timeSecond * 1000);
    });
  };
  static until= async (fn)=> {
    while (!fn()) {
      await Util.delay(0);
    }
  }

   static tryAtMost = async(promiseFunc, count = 6,delayToTry = 1) =>{
     if (count > 0 && promiseFunc ) {
       const result = await promiseFunc().catch(e => e);
       console.log(`tryAtMost result = ${result}, count = ${count}---isEROR = ${result instanceof Error}`);
       if (result instanceof Error) {
         if(_.isNumber(delayToTry)){
           await Util.delay(delayToTry);
         }
         return await Util.tryAtMost(promiseFunc, count - 1); 
       }
       return result;
     }
     return Promise.reject(`Tried ${count} times and failed`);
   };

  static createRandomString= (length) =>{
    
    let pwd = _.sampleSize(chars, length || 12) ; // lodash v4: use _.sampleSize
    return pwd.join('');
  }

  static excuteWithTimeout = (promise, timeSecond = 1) => {
    return new Promise(function(resolve, reject) {
      const ss = Util.createRandomString(10);
      console.log(TAG,'excuteWithTimeout random string = ',ss);
      timer.setTimeout(ss,function() {
        
        reject(new CustomError(knownCode.timeout_promise,{message:'timeout '+ ss}));
        timer.clearTimeout(ss);
      }, timeSecond * 1000);
      promise.then(resolve, reject);
    });
  };
}
