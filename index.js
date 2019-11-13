import 'react-native-gesture-handler';
import '@src/services/polyfill';

// import AppTemp from '@src/Temp';
import { AppRegistry} from 'react-native';
import serverService from '@src/services/wallet/Server';
import { name as appName } from './app.json';

const TAG = 'index';
console.disableYellowBox = true;
// AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerRunnable(appName, async initParams => {
  
  const serverDefault  = await serverService.getDefaultIfNullGettingDefaulList() ??{};
  global.isMainnet =  serverService.isMainnet(serverDefault);
  const { default:App} = await import('@src/App');
  AppRegistry.registerComponent(appName, () => App);
  AppRegistry.runApplication(appName, initParams);
});