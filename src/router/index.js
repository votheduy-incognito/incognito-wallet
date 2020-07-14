import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AppNavigator from './AppNavigator';
import ROUTE_NAMES from './routeNames';

export default createAppContainer(
  createSwitchNavigator(
    {
      [ROUTE_NAMES.RootApp]: AppNavigator,
    },
    {
      initialRouteName: ROUTE_NAMES.RootApp,
    },
  ),
);
