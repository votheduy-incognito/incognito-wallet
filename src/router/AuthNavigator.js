import { createStackNavigator } from 'react-navigation';
import Login from '@src/screens/Login';

export const ROUTE_NAMES = {
  Login: 'Login',
};

const AuthNavigator = createStackNavigator({
  [ROUTE_NAMES.Login]: Login
}, {
  headerMode: 'none'
});

export default AuthNavigator;