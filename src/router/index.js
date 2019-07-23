import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import MinerNavigator from './MinerNavigator';
import ROUTE_NAMES from './routeNames';
import SplashNavigator from './SplashNavigator';

export default createAppContainer(
  createSwitchNavigator(
    {
      [ROUTE_NAMES.RootApp]: AppNavigator,
      [ROUTE_NAMES.RootAuth]: AuthNavigator,
      [ROUTE_NAMES.RootSplash]: SplashNavigator,
      [ROUTE_NAMES.RootMiner]: MinerNavigator
    },
    {
      initialRouteName: ROUTE_NAMES.RootSplash,
    }
  )
);
