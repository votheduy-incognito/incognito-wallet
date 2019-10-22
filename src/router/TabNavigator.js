import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { getActiveChildNavigationOptions } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { navigationOptionsHandler } from '@src/utils/router';
import Home from '@src/screens/Home';
import Setting from '@src/screens/Setting';
import { COLORS } from '@src/styles';
import TabBarIcon from '@src/components/TabBarIcon';
import icMinerActive from '@src/assets/images/icons/ic_tab_miner_active.png';
import icMinerDeactive from '@src/assets/images/icons/ic_tab_miner_deactive.png';
import icWalletActive from '@src/assets/images/icons/walletActive.png';
import icWalletInactive from '@src/assets/images/icons/walletInactive.png';
import icIncognitoActive from '@src/assets/images/icons/incognitoActive.png';
import icIncognitoInactive from '@src/assets/images/icons/incognitoInactive.png';
import icWhalesActive from '@src/assets/images/icons/ic_tab_whales_active.png';
import icWhalesInactive from '@src/assets/images/icons/ic_tab_whales_deactive.png';
import HeaderBar from '@src/components/HeaderBar';
import MinerNavigator from './MinerNavigator';
import GameNavigator from './GameNavigator';
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
  case 'setting':
    active = icIncognitoActive;
    inactive = icIncognitoInactive;
    break;
  case 'game':
    active = icWhalesActive;
    inactive = icWhalesInactive;
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
    height: 80,
    backgroundColor: COLORS.white,
  },
  activeLabel: {
    color: COLORS.blue
  },
  tabBarLabel: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
  },
  labelStyle: {
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 10,
  },
  indicator: {
    opacity: 0,
  }
});

const Tab = createMaterialTopTabNavigator({
  [ROUTE_NAMES.Home]: navigationOptionsHandler(Home, { title: 'Wallet', tabBarLabel: renderTab('wallet', 'Wallet') }),
  [ROUTE_NAMES.RootMiner]: navigationOptionsHandler(MinerNavigator, { title: 'Nodes', header:() => null, tabBarLabel: renderTab('miner', 'Nodes') }),
  [ROUTE_NAMES.Game]: navigationOptionsHandler(GameNavigator, { title: 'Whales', header:() => null, tabBarLabel: renderTab('game', 'Whales')}),
  [ROUTE_NAMES.Setting]: navigationOptionsHandler(Setting, { title: 'You', tabBarLabel: renderTab('setting', 'You') }),
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
