import { createStackNavigator } from 'react-navigation';
import GetStarted from '@src/screens/GetStarted';
import ROUTE_NAMES from './routeNames';

const SplashNavigator = createStackNavigator({
  [ROUTE_NAMES.GetStarted]: GetStarted
}, {
  headerMode: 'none'
});

export default SplashNavigator;