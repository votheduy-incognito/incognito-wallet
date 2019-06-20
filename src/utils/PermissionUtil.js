// eslint-disable-next-line react-native/split-platform-components
import { PermissionsAndroid } from 'react-native';

const cameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message:
          'App needs access to your camera ' +
          'so you can take awesome pictures.',
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
        message: 'App needs access to your location so app can scan bluetooth',
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
module.exports = {
  cameraPermission,
  locationPermission
};
