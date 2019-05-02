import { createStackNavigator } from 'react-navigation';
import Splash from '@src/screens/Splash';
import ROUTE_NAMES from './routeNames';

const SplashNavigator = createStackNavigator({
  [ROUTE_NAMES.Splash]: Splash
}, {
  headerMode: 'none'
});

export default SplashNavigator;