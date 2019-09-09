import { NativeModules } from 'react-native';

const PrivacyGo = NativeModules.PrivacyGo;

if (typeof PrivacyGo.aggregatedRangeProve === 'function' && typeof PrivacyGo.generateBLSKeyPairFromSeed === 'function') {
  console.info('PrivacyGo was supported');

  global.aggregatedRangeProve = (data) => {
    return new Promise((resolve, reject) => {
      try {
        PrivacyGo.aggregatedRangeProve(data, function(error, result) {
          if (error) return reject(error);

          return resolve(result);
        });
      } catch (e) {
        reject(e);
      }
    });
  };

  global.generateBLSKeyPairFromSeed = (data) => {
    return new Promise((resolve, reject) => {
      try {
        PrivacyGo.generateBLSKeyPairFromSeed(data, function(error, result) {
          if (error) return reject(error);

          return resolve(result);
        });
      } catch (e) {
        reject(e);
      }
    });
  };
} else {
  // do somthing  else
  console.warn('PrivacyGo doesn\'t support on this device!');
}