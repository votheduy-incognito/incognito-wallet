import { createStackNavigator } from 'react-navigation';
import SubscribeEmail from '@src/screens/SubscribeEmail';
import ROUTE_NAMES from './routeNames';

const SubscribeEmailNavigator = createStackNavigator({
  [ROUTE_NAMES.RootSubscribeEmailNavigator]: SubscribeEmail
}, {
  headerMode: 'none'
});

export default SubscribeEmailNavigator;