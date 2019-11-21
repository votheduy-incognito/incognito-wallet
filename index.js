import 'react-native-gesture-handler';
import '@src/services/polyfill';
import serverService from '@src/services/wallet/Server';
import _ from 'lodash';
// import AppTemp from '@src/Temp';
import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';

const TAG = 'index';
global.isMainnet = undefined;
console.disableYellowBox = true;
// AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerRunnable(appName, async initParams => {
  
  const serverDefault  = await serverService.getDefaultIfNullGettingDefaulList() ??{};
  global.isMainnet = (_.isEmpty(serverDefault) ?undefined: serverService.isMainnet(serverDefault)) ??true;
  const { default:App} = await import('@src/App');
  AppRegistry.registerComponent(appName, () => App);
  AppRegistry.runApplication(appName, initParams);
});