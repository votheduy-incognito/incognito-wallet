import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { getActiveChildNavigationOptions } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { navigationOptionsHandler } from '@src/utils/router';
import Home from '@src/screens/Home';
import { COLORS } from '@src/styles';
import TabBarIcon from '@src/components/TabBarIcon';
import icMinerActive from '@src/assets/images/icons/ic_tab_nodes_active.png';
import icMinerDeactive from '@src/assets/images/icons/ic_tab_nodes_deactive.png';
import icWalletActive from '@src/assets/images/icons/ic_tab_wallet_active.png';
import icWalletInactive from '@src/assets/images/icons/ic_tab_wallet_deactive.png';
import icDappsActive from '@src/assets/images/icons/ic_tab_dapps_active.png';
import icDappsInactive from '@src/assets/images/icons/ic_tab_dapps_deactive.png';
import icDexActive from '@src/assets/images/icons/ic_tab_dex_active.png';
import icDexInactive from '@src/assets/images/icons/ic_tab_dex_deactive.png';
import HeaderBar from '@src/components/HeaderBar';
import Game from '@src/screens/Game';
import {FontStyle, scaleInApp} from '@src/styles/TextStyle';
import MinerNavigator from './MinerNavigator';
import ROUTE_NAMES from './routeNames';

const TabIcon = (type, title, { focused }) => {
  let active = null;
  let inactive = null;

  switch(type) {
  case 'wallet':
    active = icWalletActive;
    inactive = icWalletInactive;
    break;
  case 'miner':
    active = icMinerActive;
    inactive = icMinerDeactive;
    break;
  case 'dapps':
    active = icDappsActive;
    inactive = icDappsInactive;
    break;
  case 'dex':
    active = icDexActive;
    inactive = icDexInactive;
  }

  return (
    <View style={styles.tabBarLabel}>
      <TabBarIcon
        image={focused ? active
          : inactive}
      />
      <Text style={[styles.labelStyle, focused ? styles.activeLabel : {}]}>{title.toUpperCase()}</Text>
    </View>
  );
};
const renderTab = (type, title) => TabIcon.bind(null, type, title);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingBottom: 30,
    height: 95,
    backgroundColor: COLORS.white,
  },
  activeLabel: {
    color: COLORS.dark1,
    fontSize: scaleInApp(10),
    ...FontStyle.bold,
  },
  tabBarLabel: {
    flexDirection: 'column',
    flex: 1,
    width: 70,
    alignItems: 'center',
  },
  labelStyle: {
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 4,
  },
  indicator: {
    opacity: 0,
  }
});

const Tab = createMaterialTopTabNavigator({
  [ROUTE_NAMES.Home]: navigationOptionsHandler(Home, { header: () => null, tabBarLabel: renderTab('wallet', 'Wallet') }),
  [ROUTE_NAMES.RootMiner]: navigationOptionsHandler(MinerNavigator, { title: 'Nodes', header: () => null, tabBarLabel: renderTab('miner', 'Nodes') }),
  [ROUTE_NAMES.DApps]: navigationOptionsHandler(Game, { title: 'DApps', header: () => null, tabBarLabel: renderTab('dapps', 'DApps')}),
  [ROUTE_NAMES.Dex]: navigationOptionsHandler(Game, { title: 'Dex', header: () => null, tabBarLabel: renderTab('dex', 'Dex')}),
}, {
  initialRouteName: ROUTE_NAMES.Home,
  swipeEnabled: false,
  animationEnabled: true,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    style: styles.container,
    tabStyle: styles.tabStyle,
    indicatorStyle: styles.indicator,
  },
  defaultNavigationOptions: {
    header: HeaderBar
  },
  headerMode:'screen',
  navigationOptions: ({ navigation, screenProps }) => {
    const child = getActiveChildNavigationOptions(navigation, screenProps);
    const { routeName } = navigation.state.routes[navigation.state.index];

    // console.log(TAG,'navigationOptions child = ',child);
    // You can do whatever you like here to pick the title based on the route name
    const title = routeName;

    return {
      title,
      ...child,
    };
  },
});

export default Tab;
