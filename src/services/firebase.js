import firebase from 'react-native-firebase';
import _ from 'lodash';
import DeviceInfo from 'react-native-device-info';

const TAG = 'firebase';

export const logEvent = async (event, data = {}) => {
  if (!_.isEmpty(event)) {
    try {
      const deviceId = DeviceInfo.getUniqueId();
      const instance = firebase.analytics();
      const result = await instance.logEvent(event, {
        deviceId,
        ...data,
      });

      // console.debug('FIREBASE EVENT', event);
    } catch (error) {
      console.debug(TAG, 'logEvent error = ', error);
    }
  }
};

export const getToken = () => {
  return firebase.messaging().getToken();
};
