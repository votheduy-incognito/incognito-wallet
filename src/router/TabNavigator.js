import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Home from '@src/screens/Home';
import Setting from '@src/screens/Setting';
import { COLORS } from '@src/styles';
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
  [ROUTE_NAMES.Home]: Home,
  [ROUTE_NAMES.Setting]: Setting,
}, {
  initialRouteName: ROUTE_NAMES.Home,
  tabBarOptions: {
    style: styles.container,
    labelStyle: styles.labelStyle,
    tabStyle: styles.tabStyle,
    activeTintColor: COLORS.blue
  },
});

export default Tab;