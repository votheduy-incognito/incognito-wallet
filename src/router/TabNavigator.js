import { StyleSheet } from 'react-native';
import { createBottomTabNavigator, getActiveChildNavigationOptions } from 'react-navigation';
import { navigationOptionsHandler } from '@src/utils/router';
import Home from '@src/screens/Home';
import Setting from '@src/screens/Setting';
import { COLORS } from '@src/styles';
import HeaderBar from '@src/components/HeaderBar';
import ROUTE_NAMES from './routeNames';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    height: 80
  },
  labelStyle: {
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1,
    textAlign: 'center'
  },
});

const Tab = createBottomTabNavigator({
  [ROUTE_NAMES.Home]: navigationOptionsHandler(Home, { title: 'Wallet' }),
  [ROUTE_NAMES.Setting]: navigationOptionsHandler(Setting, { title: 'Setting' }),
}, {
  initialRouteName: ROUTE_NAMES.Home,
  tabBarOptions: {
    style: styles.container,
    labelStyle: styles.labelStyle,
    tabStyle: styles.tabStyle,
    activeTintColor: COLORS.blue
  },
  defaultNavigationOptions: {
    header: HeaderBar
  },
  navigationOptions: ({ navigation, screenProps }) => {
    const child = getActiveChildNavigationOptions(navigation, screenProps);
    const { routeName } = navigation.state.routes[navigation.state.index];
  
    // You can do whatever you like here to pick the title based on the route name
    const title = routeName;
  
    return {
      title,
      ...child,
    };
  }
});

export default Tab;