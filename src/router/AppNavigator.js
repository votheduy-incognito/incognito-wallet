import React from 'react';
import { createStackNavigator } from 'react-navigation';
import UserHeaderBoard from '@src/screens/UserHeaderBoard';
import Staking from '@src/screens/Staking';
import Defragment from '@src/screens/Defragment';
import SendConstant from '@src/screens/SendConstant';
import NetworkSetting from '@src/screens/NetworkSetting';
import CreateAccount from '@src/screens/CreateAccount';
import SeedPhrase from '@src/screens/SeedPhrase';
import ImportAccount from '@src/screens/ImportAccount';
import ExportAccount from '@src/screens/ExportAccount';
import HamburgerHeader from '@src/components/HamburgerHeader';
import CreateSendToken from '@src/screens/CreateSendToken';
import FollowToken from '@src/screens/FollowToken';
import HistoryToken from '@src/screens/HistoryToken';
import UserHeader from '@src/components/UserHeader';
import { THEME } from '@src/styles';
import { navigationOptionsHandler } from '@src/utils/router';
import ROUTE_NAMES from './routeNames';
import DrawerNavigator from './DrawerNavigator';

const AppNavigator = createStackNavigator({
  DrawerNavigator,
  [ROUTE_NAMES.UserHeaderBoard]: navigationOptionsHandler(UserHeaderBoard),
  [ROUTE_NAMES.SendConstant]: navigationOptionsHandler(SendConstant),
  [ROUTE_NAMES.Staking]: navigationOptionsHandler(Staking),
  [ROUTE_NAMES.Defragment]: navigationOptionsHandler(Defragment),
  [ROUTE_NAMES.NetworkSetting]: navigationOptionsHandler(NetworkSetting),
  [ROUTE_NAMES.CreateAccount]: navigationOptionsHandler(CreateAccount),
  [ROUTE_NAMES.ImportAccount]: navigationOptionsHandler(ImportAccount),
  [ROUTE_NAMES.SeedPhrase]: navigationOptionsHandler(SeedPhrase),
  [ROUTE_NAMES.ExportAccount]: navigationOptionsHandler(ExportAccount),
  [ROUTE_NAMES.CreateSendToken]: navigationOptionsHandler(CreateSendToken),
  [ROUTE_NAMES.FollowToken]: navigationOptionsHandler(FollowToken),
  [ROUTE_NAMES.HistoryToken]: navigationOptionsHandler(HistoryToken),
}, {
  initialRouteName: 'DrawerNavigator',
  defaultNavigationOptions: ({ navigation }) => {
    const handleUserPress = () => {
      navigation.navigate(ROUTE_NAMES.UserHeaderBoard);
    };

    return {
      headerRight: <UserHeader onPress={handleUserPress} />,
      headerLeft: <HamburgerHeader
        onPress={() => {
          navigation.toggleDrawer();
        }}
      />,
      headerTintColor: THEME.header.headerTintColor,
      headerStyle: {
        backgroundColor: THEME.header.backgroundColor,
      },
    };
  }
});

export default AppNavigator;