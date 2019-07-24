/**
 * @providesModule Util
 */
import { Linking } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';

const TAG = 'Util';
export default class Util {
  static resetRoute = (navigation, routeName, params = {}) => {
    const resetAction = StackActions.reset({
      index: 0,
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

  static excuteWithTimeout = (promise, timeSecond = 1) => {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error('timeout'));
      }, timeSecond * 1000);
      promise.then(resolve, reject);
    });
  };
}
