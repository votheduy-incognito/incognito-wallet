import { createStackNavigator } from 'react-navigation';
import CreateAccount from '@src/screens/CreateAccount';
import Defragment from '@src/screens/Defragment';
import ExportAccount from '@src/screens/ExportAccount';
import FollowToken from '@src/screens/FollowToken';
import ImportAccount from '@src/screens/ImportAccount';
import NetworkSetting from '@src/screens/NetworkSetting';
import SeedPhrase from '@src/screens/SeedPhrase';
import Staking from '@src/screens/Staking';
import UserHeaderBoard from '@src/screens/UserHeaderBoard';
import WalletDetail from '@src/screens/WalletDetail';
import ReceiveCrypto from '@src/screens/ReceiveCrypto';
import SendCrypto from '@src/screens/SendCrypto';
import Deposit from '@src/screens/Deposit';
import Withdraw from '@src/screens/Withdraw';
import CreateToken from '@src/screens/CreateToken';
import HeaderBar from '@src/components/HeaderBar';
import { navigationOptionsHandler } from '@src/utils/router';
import ROUTE_NAMES from './routeNames';
import TabNavigator from './TabNavigator';

const AppNavigator = createStackNavigator(
  {
    TabNavigator,
    [ROUTE_NAMES.UserHeaderBoard]: navigationOptionsHandler(UserHeaderBoard),
    [ROUTE_NAMES.Staking]: navigationOptionsHandler(Staking),
    [ROUTE_NAMES.Defragment]: navigationOptionsHandler(Defragment),
    [ROUTE_NAMES.NetworkSetting]: navigationOptionsHandler(NetworkSetting),
    [ROUTE_NAMES.CreateAccount]: navigationOptionsHandler(CreateAccount),
    [ROUTE_NAMES.ImportAccount]: navigationOptionsHandler(ImportAccount),
    [ROUTE_NAMES.SeedPhrase]: navigationOptionsHandler(SeedPhrase),
    [ROUTE_NAMES.ExportAccount]: navigationOptionsHandler(ExportAccount),
    [ROUTE_NAMES.FollowToken]: navigationOptionsHandler(FollowToken, { title: 'Follow Token' }),
    [ROUTE_NAMES.WalletDetail]: navigationOptionsHandler(WalletDetail),
    [ROUTE_NAMES.ReceiveCrypto]: navigationOptionsHandler(ReceiveCrypto),
    [ROUTE_NAMES.SendCrypto]: navigationOptionsHandler(SendCrypto),
    [ROUTE_NAMES.Deposit]: navigationOptionsHandler(Deposit),
    [ROUTE_NAMES.Withdraw]: navigationOptionsHandler(Withdraw),
    [ROUTE_NAMES.CreateToken]: navigationOptionsHandler(CreateToken),
  },
  {
    initialRouteName: 'TabNavigator',
    defaultNavigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state;
      // You can do whatever you like here to pick the title based on the route name
      const title = routeName;
      return {
        title,
        header: HeaderBar,
      };
    }
  }
);

export default AppNavigator;
