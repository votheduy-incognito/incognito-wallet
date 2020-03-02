import Node from '@src/screens/Node';
import { createStackNavigator } from 'react-navigation-stack';
import AddNode from '@src/screens/AddNode';
import AddStake from '@src/screens/AddStake';
import Unstake from '@src/screens/Unstake';
import AddSelfNode from '@src/screens/AddSelfNode';
import LinkDevice from '@screens/LinkDevice';
import HeaderBar from '@src/components/HeaderBar';
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
    [ROUTE_NAMES.Node]: navigationOptionsHandler(Node,{ header: null }),
    [ROUTE_NAMES.AddNode]: navigationOptionsHandler(AddNode, { title: 'Add Node' }),
    [ROUTE_NAMES.LinkDevice]: navigationOptionsHandler(LinkDevice, { title: 'Link Device' }),
    [ROUTE_NAMES.AddStake]: navigationOptionsHandler(AddStake, { title: 'Stake' }),
    [ROUTE_NAMES.Unstake]: navigationOptionsHandler(Unstake, { title: 'Unstake' }),
    [ROUTE_NAMES.AddSelfNode]: navigationOptionsHandler(AddSelfNode, { title: 'Virtual Node' }),
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
        headerBackground: THEME.header.backgroundColor,
        gesturesEnabled: false,
      };
    },
    initialRouteName:ROUTE_NAMES.Node,
    headerMode: 'screen'
  }
);

export default MinerNavigator;
