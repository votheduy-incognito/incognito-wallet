import { createStackNavigator } from 'react-navigation';
import Login from '@src/screens/Login';
import CreatePassword from '@src/screens/CreatePassword';
import ROUTE_NAMES from './routeNames';

const AuthNavigator = createStackNavigator({
  [ROUTE_NAMES.Login]: Login,
  [ROUTE_NAMES.CreatePassword]: CreatePassword
}, {
  headerMode: 'none'
});

export default AuthNavigator;