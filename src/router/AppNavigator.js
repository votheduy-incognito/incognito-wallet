import { THEME } from '@src/styles';
import { createStackNavigator } from 'react-navigation';
import CreateAccount from '@src/screens/CreateAccount';
import ExportAccount from '@src/screens/ExportAccount';
import FollowToken from '@src/screens/FollowToken';
import ImportAccount from '@src/screens/ImportAccount';
import NetworkSetting from '@src/screens/NetworkSetting';
import SeedPhrase from '@src/screens/SeedPhrase';
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
    [ROUTE_NAMES.RootTab]: TabNavigator,
    [ROUTE_NAMES.UserHeaderBoard]: navigationOptionsHandler(UserHeaderBoard, { title: 'Accounts' }),
    [ROUTE_NAMES.NetworkSetting]: navigationOptionsHandler(NetworkSetting, { title: 'Network' }),
    [ROUTE_NAMES.CreateAccount]: navigationOptionsHandler(CreateAccount, { title: 'Create Account' }),
    [ROUTE_NAMES.ImportAccount]: navigationOptionsHandler(ImportAccount, { title: 'Import Account' }),
    [ROUTE_NAMES.SeedPhrase]: navigationOptionsHandler(SeedPhrase),
    [ROUTE_NAMES.ExportAccount]: navigationOptionsHandler(ExportAccount, { title: 'Export Account' }),
    [ROUTE_NAMES.FollowToken]: navigationOptionsHandler(FollowToken, { title: 'Add a token' }),
    [ROUTE_NAMES.WalletDetail]: navigationOptionsHandler(WalletDetail),
    [ROUTE_NAMES.ReceiveCrypto]: navigationOptionsHandler(ReceiveCrypto, { title: 'Receive' }),
    [ROUTE_NAMES.SendCrypto]: navigationOptionsHandler(SendCrypto, { title: 'Send' }),
    [ROUTE_NAMES.Deposit]: navigationOptionsHandler(Deposit),
    [ROUTE_NAMES.Withdraw]: navigationOptionsHandler(Withdraw),
    [ROUTE_NAMES.CreateToken]: navigationOptionsHandler(CreateToken, { title: 'Create Token' }),
  },
  {
    initialRouteName: ROUTE_NAMES.RootTab,
    defaultNavigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state;
      // You can do whatever you like here to pick the title based on the route name
      const title = routeName;
      return {
        title,
        header: HeaderBar,
        headerBackground: THEME.header.backgroundColor
      };
    }
  }
);

export default AppNavigator;
