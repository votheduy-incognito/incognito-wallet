import { createStackNavigator } from 'react-navigation';
import Login from '@src/screens/Login';
import ROUTE_NAMES from './routeNames';

const AuthNavigator = createStackNavigator({
  [ROUTE_NAMES.Login]: Login
}, {
  headerMode: 'none'
});

export default AuthNavigator;