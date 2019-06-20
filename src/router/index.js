import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import ROUTE_NAMES from './routeNames';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import SplashNavigator from './SplashNavigator';
import MinerNavigator from './MinerNavigator';

export default createAppContainer(
  createSwitchNavigator(
    {
      [ROUTE_NAMES.RootApp]: AppNavigator,
      [ROUTE_NAMES.RootAuth]: AuthNavigator,
      [ROUTE_NAMES.RootSplash]: SplashNavigator,
      [ROUTE_NAMES.RootMiner]: MinerNavigator
    },
    {
      initialRouteName: ROUTE_NAMES.RootMiner
    }
  )
);
