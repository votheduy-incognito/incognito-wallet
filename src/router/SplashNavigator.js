import { createStackNavigator } from 'react-navigation';
import Splash from '@src/screens/Splash';

export const ROUTE_NAMES = {
  Splash: 'Splash',
};

const SplashNavigator = createStackNavigator({
  [ROUTE_NAMES.Splash]: Splash
}, {
  headerMode: 'none'
});

export default SplashNavigator;