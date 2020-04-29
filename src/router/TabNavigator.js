import React from 'react';
import { StyleSheet, View } from 'react-native';
import { getActiveChildNavigationOptions } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { navigationOptionsHandler } from '@src/utils/router';
import Wallet from '@src/screens/Wallet';
import Home from '@src/screens/Home';
import Community from '@src/screens/Community';
import { COLORS } from '@src/styles';
import TabBarIcon from '@src/components/TabBarIcon';
import icMinerActive from '@src/assets/images/icons/ic_tab_nodes_active.png';
import icMinerDeactive from '@src/assets/images/icons/ic_tab_nodes_deactive.png';
import icWalletActive from '@src/assets/images/icons/ic_tab_wallet_active.png';
import icWalletInactive from '@src/assets/images/icons/ic_tab_wallet_deactive.png';
import icHomeActive from '@src/assets/images/icons/ic_home_active.png';
import icHomeDeactive from '@src/assets/images/icons/ic_home_deactive.png';
import icCommunityActive from '@src/assets/images/icons/ic_community_active.png';
import icCommunityDeactive from '@src/assets/images/icons/ic_community_deactive.png';
import HeaderBar from '@src/components/HeaderBar';
import MinerNavigator from './MinerNavigator';
import ROUTE_NAMES from './routeNames';

const TabIcon = (type, title, { focused }) => {
  let active = null;
  let inactive = null;

  switch (type) {
  case 'wallet':
    active = icWalletActive;
    inactive = icWalletInactive;
    break;
  case 'miner':
    active = icMinerActive;
    inactive = icMinerDeactive;
    break;
  case 'home':
    active = icHomeActive;
    inactive = icHomeDeactive;
    break;
  case 'community':
    active = icCommunityActive;
    inactive = icCommunityDeactive;
  }

  return (
    <View style={styles.tabBarLabel}>
      <TabBarIcon
        image={focused ? active
          : inactive}
      />
      {/* Remove title for a while */}
      {/* <Text style={[styles.labelStyle, focused ? styles.activeLabel : {}]}>{title.toUpperCase()}</Text> */}
    </View>
  );
};
const renderTab = (type, title) => TabIcon.bind(null, type, title);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    height: 70,
    backgroundColor: COLORS.white,
  },
  // activeLabel: {
  //   color: COLORS.dark1,
  //   fontSize: 10,
  //   ...FontStyle.bold,
  // },
  tabBarLabel: {
    flexDirection: 'column',
    flex: 1,
    width: 100,
    alignItems: 'center',
  },
  // labelStyle: {
  //   textTransform: 'uppercase',
  //   fontSize: 10,
  //   fontWeight: '500',
  //   letterSpacing: 1,
  //   textAlign: 'center',
  //   marginTop: 4,
  //   color: COLORS.lightGrey1,
  // },
  indicator: {
    opacity: 0,
  }
});

const Tab = createMaterialTopTabNavigator({
  [ROUTE_NAMES.Home]: navigationOptionsHandler(Home, { header: () => null, tabBarLabel: renderTab('home', 'Home') }),
  [ROUTE_NAMES.RootMiner]: navigationOptionsHandler(MinerNavigator, { title: 'Nodes', header: () => null, tabBarLabel: renderTab('miner', 'Nodes') }),
  [ROUTE_NAMES.Wallet]: navigationOptionsHandler(Wallet, { header: () => null, tabBarLabel: renderTab('wallet', 'Wallet') }),
  [ROUTE_NAMES.Community]: navigationOptionsHandler(Community, { header: () => null, tabBarLabel: renderTab('community', 'Community') }),
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
  headerMode: 'screen',
  navigationOptions: ({ navigation, screenProps }) => {
    const child = getActiveChildNavigationOptions(navigation, screenProps);
    const { routeName } = navigation.state.routes[navigation.state.index];

    // console.log(TAG,'navigationOptions child = ',child);
    // You can do whatever you like here to pick the title based on the route name
    const title = routeName;

    return {
      title,
      gesturesEnabled: false,
      ...child,
    };
  },
});

export default Tab;
