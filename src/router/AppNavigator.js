import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import React from 'react';

import Home from '@src/screens/Home';
import Setting from '@src/screens/Setting';
import UserHeaderBoard from '@src/screens/UserHeaderBoard';
import HamburgerHeader from '@src/components/HamburgerHeader';
import UserHeader from '@src/components/UserHeader';
import { THEME } from '@src/styles';
import ROUTE_NAMES from './routeNames';

const Drawer = createDrawerNavigator({
  [ROUTE_NAMES.Home]: Home,
  [ROUTE_NAMES.Setting]: Setting,
  [ROUTE_NAMES.UserHeaderBoard]: UserHeaderBoard
}, {
  initialRouteName: ROUTE_NAMES.Home
});

const AppNavigator = createStackNavigator({
  Drawer
},
{
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