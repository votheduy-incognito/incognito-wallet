import { createDrawerNavigator } from 'react-navigation';
import Home from '@src/screens/Home';
import Setting from '@src/screens/Setting';
import ROUTE_NAMES from './routeNames';

const Drawer = createDrawerNavigator({
  [ROUTE_NAMES.Home]: Home,
  [ROUTE_NAMES.Setting]: Setting,
}, {
  initialRouteName: ROUTE_NAMES.Home,
});

export default Drawer;