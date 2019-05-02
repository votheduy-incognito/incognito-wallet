import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SplashNavigator from './SplashNavigator';

export default createAppContainer(createSwitchNavigator({
  App: AppNavigator,
  Auth: AuthNavigator,
  Splash: SplashNavigator
}, {
  initialRouteName: 'Splash'
}));