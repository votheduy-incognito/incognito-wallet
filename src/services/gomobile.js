import { NativeModules } from 'react-native';

const PrivacyGo = NativeModules.PrivacyGo;

const log = (...args) => console.log('GOMODULE', ...args);
try {
  const asyncMethods = [
    'deriveSerialNumber',
    'randomScalars',
    'initPrivacyTx',
    'initPrivacyTokenTx',
    'initBurningRequestTx',
    'initWithdrawRewardTx',
    'staking',
    'generateBLSKeyPairFromSeed'
  ];
  const syncMethods = [
    'scalarMultBase',
    'generateKeyFromSeed'
  ];

  asyncMethods.forEach(methodName => {
    global[methodName] = (data) => {
      return new Promise((resolve, reject) => {
        try {
          log(`${methodName} called`);
          PrivacyGo[methodName](data, function(error, result) {
            if (error) {
              throw error;
            }
  
            log(`${methodName} called successfully with result`, result);
            return resolve(result);
          });
        } catch (e) {
          log(`${methodName} called with error`, e);
          reject(e);
        }
      });
    };
  });

  syncMethods.forEach(methodName => {
    global[methodName] = (input) => {
      const rs = PrivacyGo[methodName](input);

      if (rs === null) {
        throw new Error(`${methodName} go module called with error`);
      }
      return rs;
    };
  });

  console.log('GO modules were loaded');
} catch {
  console.error('GO modules can not loaded');
}