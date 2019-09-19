import { createStackNavigator } from 'react-navigation';
import Game from '@src/screens/Game';
import ROUTE_NAMES from './routeNames';

export const TAG = 'MinerNavigator';

const GameNavigator = createStackNavigator({
  [ROUTE_NAMES.Game]: Game
}, {
  headerMode: 'none'
});

export default GameNavigator;
