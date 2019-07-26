/* eslint-disable import/no-cycle */
import AddDevice from '@src/screens/AddDevice';
import DetailDevice from '@screens/DetailDevice';
import HomeMine from '@screens/HomeMine';
import { createStackNavigator } from 'react-navigation';
import SetupWifiDevice from '@screens/SetupWifiDevice';
import AddNode from '@src/screens/AddNode';
import Withdraw from '@src/screens/Withdraw';
import AddStake from '@src/screens/AddStake';
import TextStyle, { scaleInApp } from '@src/styles/TextStyle';
import { sizeHeader } from '@src/components/HeaderBar/style';
import { imagesVector } from '@src/assets';
import ROUTE_NAMES from './routeNames';

export const TAG = 'MinerNavigator';
const defaultNavigationOptions={

};
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
        headerTitle:'Select router'
      }
    },
    [ROUTE_NAMES.AddNode]: {
      screen:AddNode,
      navigationOptions: {
        headerTitle:'Add Node'
      }
    },
    [ROUTE_NAMES.AddStake]: {
      screen:AddStake,
      navigationOptions: {
        headerTitle:'Add Stake'
      }
    },
    [ROUTE_NAMES.SetupWifiDevice]: {
      screen:SetupWifiDevice,
      navigationOptions: {
        headerTitle:'Setup Wifi'
      }
    },
    [ROUTE_NAMES.DetailDevice]:{
      screen:DetailDevice,
      navigationOptions: {
        header: null
      }
    },
    // [ROUTE_NAMES.Withdraw]:{
    //   screen:Withdraw,
    //   navigationOptions: {
    //     header: null
    //   }
    // }
  },
  {
    defaultNavigationOptions:{
      headerBackTitle:null,
      headerTintColor: '#fff',
      headerTitleStyle:{
        ...TextStyle.bigText,
        fontWeight:'bold',
        color:'#FFFFFF'
      },
      headerStyle:{
        height:sizeHeader.height/2,
        backgroundColor:'#0ECBEE'
      }
    },
    headerMode: 'screen'
  }
);

export default MinerNavigator;
