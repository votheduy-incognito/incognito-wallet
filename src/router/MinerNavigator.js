/* eslint-disable import/no-cycle */
import AddDevice from '@src/screens/AddDevice';
import DetailDevice from '@screens/DetailDevice';
import HomeMine from '@screens/HomeMine';
import { createStackNavigator } from 'react-navigation';
import SetupWifiDevice from '@screens/SetupWifiDevice';
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
    [ROUTE_NAMES.SetupWifiDevice]: {
      screen:SetupWifiDevice,
      navigationOptions: {
        headerTitle:'Setup Wifi'
      }
    },
    [ROUTE_NAMES.DetailDevice]: DetailDevice
  },
  {
    headerMode: 'screen'
  }
);

export default MinerNavigator;
