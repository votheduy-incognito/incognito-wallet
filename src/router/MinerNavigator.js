/* eslint-disable import/no-cycle */
import { createStackNavigator } from 'react-navigation';
import AddDevice from '@src/screens/AddDevice';
import ROUTE_NAMES from './routeNames';

export const TAG = 'MinerNavigator';
const MinerNavigator = createStackNavigator(
  {
    [ROUTE_NAMES.AddDevice]: AddDevice
  },
  {
    headerMode: 'none'
  }
);

export default MinerNavigator;
