import '@src/services/polyfill';
import App from '@src/App';
// import AppTemp from '@src/Temp';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
