import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AuthNavigator, { ROUTE_NAMES as authRouteNames } from './AuthNavigator';
import AppNavigator, { ROUTE_NAMES as appRouteNames }  from './AppNavigator';
import SplashNavigator, { ROUTE_NAMES as splashRouteNames }  from './SplashNavigator';

export default createAppContainer(createSwitchNavigator({
  App: AppNavigator,
  Auth: AuthNavigator,
  Splash: SplashNavigator
}, {
  initialRouteName: 'Auth'
}));

export const ROUTE_NAMES = {
  ...authRouteNames,
  ...appRouteNames,
  ...splashRouteNames
};