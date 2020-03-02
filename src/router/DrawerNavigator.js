import { createDrawerNavigator } from 'react-navigation';
import Home from '@src/screens/Wallet';
import Setting from '@src/screens/Setting';
import ROUTE_NAMES from './routeNames';

const Drawer = createDrawerNavigator({
  [ROUTE_NAMES.Wallet]: Home,
  [ROUTE_NAMES.Setting]: Setting,
}, {
  initialRouteName: ROUTE_NAMES.Wallet,
});

export default Drawer;
