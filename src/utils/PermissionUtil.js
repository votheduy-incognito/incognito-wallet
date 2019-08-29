// eslint-disable-next-line react-native/split-platform-components
import { PermissionsAndroid } from 'react-native';

const cameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'To scan QR codes, please give Incognito access to your camera.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    );
    return Promise.resolve(granted === PermissionsAndroid.RESULTS.GRANTED);
  } catch (err) {
    console.warn(err);
    return Promise.reject(err);
  }
};
const locationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title: 'Location Permission',
        message: 'To find Node, please give this app access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    );
    return Promise.resolve(granted === PermissionsAndroid.RESULTS.GRANTED);
  } catch (err) {
    console.warn(err);
    return Promise.reject(err);
  }
};
export { cameraPermission, locationPermission };

