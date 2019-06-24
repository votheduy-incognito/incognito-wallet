/* eslint-disable import/no-cycle */
import AddDevice from '@src/screens/AddDevice';
import ConfigDevice from '@src/screens/ConfigDevice';
import DetailDevice from '@src/screens/DetailDevice';
import HomeMine from '@src/screens/HomeMine';
import { createStackNavigator } from 'react-navigation';
import ROUTE_NAMES from './routeNames';

export const TAG = 'MinerNavigator';
const MinerNavigator = createStackNavigator(
  {
    [ROUTE_NAMES.MineSetting]:{
      screen:HomeMine,
      navigationOptions: {
        header: null
      }
    },
    [ROUTE_NAMES.AddDevice]: {
      screen:AddDevice,
      navigationOptions: {
        headerTitle:'Add Device'
      }
    },
    [ROUTE_NAMES.ConfigDevice]:{
      screen:ConfigDevice,
      navigationOptions: {
        headerTitle:'Config Device'
      }
    },
    [ROUTE_NAMES.DetailDevice]: DetailDevice
  },
  {
    headerMode: 'screen'
  }
);

export default MinerNavigator;
