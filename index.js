import 'react-native-gesture-handler';
import '@src/services/polyfill';
import _ from 'lodash';
// import AppTemp from '@src/Temp';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

const TAG = 'index';
global.isMainnet = false;
console.disableYellowBox = true;

AppRegistry.registerRunnable(appName, async initParams => {
  const { default:serverService} = await import('@src/services/wallet/Server');
  const serverDefault  = await serverService.getDefaultIfNullGettingDefaulList() ??{};
  global.isMainnet = (_.isEmpty(serverDefault) ?global.isMainnet: serverService.isMainnet(serverDefault)) ??true;
  const { default:App} = await import('@src/App');
  AppRegistry.registerComponent(appName, () => App);
  AppRegistry.runApplication(appName, initParams);
});