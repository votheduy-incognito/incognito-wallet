/* eslint-disable import/no-cycle */
import AddDevice from '@src/screens/AddDevice';
import DetailDevice from '@screens/DetailDevice';
import HomeMine from '@screens/HomeMine';
import { createStackNavigator } from 'react-navigation';
import SetupWifiDevice from '@screens/SetupWifiDevice';
import AddNode from '@src/screens/AddNode';
import AddStake from '@src/screens/AddStake';
import TextStyle, { scaleInApp } from '@src/styles/TextStyle';
import { sizeHeader } from '@src/components/HeaderBar/style';
import { imagesVector } from '@src/assets';
import AddSelfNode from '@src/screens/AddSelfNode';
import HeaderBar from '@src/components/HeaderBar/HeaderBar';
import { navigationOptionsHandler } from '@src/utils/router';
import { THEME } from '@src/styles';
import GetStartedAddNode from '@src/screens/GetStartedAddNode';
import ROUTE_NAMES from './routeNames';

export const TAG = 'MinerNavigator';
const GetStaredMineStake = createStackNavigator(
  {
    [ROUTE_NAMES.GetStaredAddNode]: navigationOptionsHandler(GetStartedAddNode, { header: null }),
  },
  {
    initialRouteName:ROUTE_NAMES.GetStaredAddNode,
    headerMode: 'screen'
  }
);
const MinerNavigator = createStackNavigator(
  {
    [ROUTE_NAMES.HomeMine]: navigationOptionsHandler(HomeMine, { header: null }),
    [ROUTE_NAMES.AddDevice]: navigationOptionsHandler(AddDevice, { title: 'Select router' }),
    [ROUTE_NAMES.AddNode]: navigationOptionsHandler(AddNode, { title: 'Add Node' }),
    [ROUTE_NAMES.AddStake]: navigationOptionsHandler(AddStake, { title: 'Stake' }),
    [ROUTE_NAMES.SetupWifiDevice]: navigationOptionsHandler(SetupWifiDevice, { title: 'Setup Wifi' }),
    [ROUTE_NAMES.AddSelfNode]: navigationOptionsHandler(AddSelfNode, { title: 'Virtual Node' }),
    [ROUTE_NAMES.DetailDevice]: navigationOptionsHandler(DetailDevice, { header: null }),
    [ROUTE_NAMES.GetStaredMineStake]: navigationOptionsHandler(GetStaredMineStake, { title: null }),
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state;
      // You can do whatever you like here to pick the title based on the route name
      const title = routeName;
      return {
        title,
        header: HeaderBar,
        headerBackground: THEME.header.backgroundColor
      };
    },
    initialRouteName:ROUTE_NAMES.HomeMine,
    headerMode: 'screen'
  }
);

export default MinerNavigator;
