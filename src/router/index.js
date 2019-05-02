import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import ROUTE_NAMES from './routeNames';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SplashNavigator from './SplashNavigator';

export default createAppContainer(createSwitchNavigator({
  [ROUTE_NAMES.RootApp]: AppNavigator,
  [ROUTE_NAMES.RootAuth]: AuthNavigator,
  [ROUTE_NAMES.RootSplash]: SplashNavigator
}, {
  initialRouteName: ROUTE_NAMES.RootSplash
}));