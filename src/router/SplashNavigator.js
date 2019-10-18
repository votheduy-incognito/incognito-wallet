import { createStackNavigator } from 'react-navigation-stack';
import Wizard from '@src/screens/Wizard';
import GetStarted from '@src/screens/GetStarted';
import ROUTE_NAMES from './routeNames';

const SplashNavigator = createStackNavigator({
  [ROUTE_NAMES.Wizard]: Wizard,
  [ROUTE_NAMES.GetStarted]: GetStarted
}, {
  initialRouteName: ROUTE_NAMES.Wizard,
  headerMode: 'none'
});

export default SplashNavigator;
