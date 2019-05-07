import React from 'react';
import { createStackNavigator } from 'react-navigation';
import UserHeaderBoard from '@src/screens/UserHeaderBoard';
import Staking from '@src/screens/Staking';
import SendConstant from '@src/screens/SendConstant';
import HamburgerHeader from '@src/components/HamburgerHeader';
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
}, {
  initialRouteName: 'DrawerNavigator',
  defaultNavigationOptions: ({ navigation }) => {
    const handleUserPress = () => {
      navigation.navigate(ROUTE_NAMES.UserHeaderBoard);
    };

    return {
      headerRight: <UserHeader userName='User' onPress={handleUserPress} />,
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