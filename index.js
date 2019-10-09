import 'intl';
import 'intl/locale-data/jsonp/en';
import '@src/services/gomobile';
import App from '@src/App';
// import AppTemp from '@src/Temp';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';

console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => App);
