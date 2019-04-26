import { createDrawerNavigator, createStackNavigator } from 'react-navigation';
import React from 'react';

import Home from '@src/screens/Home';
import Contact from '@src/screens/Contact';
import HamburgerHeader from '@src/components/HamburgerHeader';
import UserHeader from '@src/components/UserHeader';

import { THEME } from '@src/styles';

export const ROUTE_NAMES = {
  Home: 'Home',
  Contact: 'Contact',
};

const Drawer = createDrawerNavigator({
  [ROUTE_NAMES.Home]: Home,
  [ROUTE_NAMES.Contact]: Contact
}, {
  initialRouteName: ROUTE_NAMES.Home
});

const AppNavigator = createStackNavigator({
  Drawer
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    headerRight: <UserHeader userName='User' />,
    headerLeft: <HamburgerHeader
      onPress={() => {
        navigation.toggleDrawer();
      }}
    />,
    headerTintColor: THEME.header.headerTintColor,
    headerStyle: {
      backgroundColor: THEME.header.backgroundColor,
    },
  })
});

export default AppNavigator;