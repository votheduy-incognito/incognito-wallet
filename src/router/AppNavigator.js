import UserHeaderContainer from '@src/components/UserHeader';
import CreateAccount from '@src/screens/CreateAccount';
import CreateSendToken from '@src/screens/CreateSendToken';
import Defragment from '@src/screens/Defragment';
import ExportAccount from '@src/screens/ExportAccount';
import FollowToken from '@src/screens/FollowToken';
import HistoryToken from '@src/screens/HistoryToken';
import ImportAccount from '@src/screens/ImportAccount';
import NetworkSetting from '@src/screens/NetworkSetting';
import SeedPhrase from '@src/screens/SeedPhrase';
import SendConstant from '@src/screens/SendConstant';
import Staking from '@src/screens/Staking';
import UserHeaderBoard from '@src/screens/UserHeaderBoard';
import WalletDetail from '@src/screens/WalletDetail';
import ReceiveCrypto from '@src/screens/ReceiveCrypto';
import SendCrypto from '@src/screens/SendCrypto';
import Deposit from '@src/screens/Deposit';
import Withdraw from '@src/screens/Withdraw';
import { THEME } from '@src/styles';
import { navigationOptionsHandler } from '@src/utils/router';
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import ROUTE_NAMES from './routeNames';
import TabNavigator from './TabNavigator';

const AppNavigator = createStackNavigator(
  {
    TabNavigator,
    [ROUTE_NAMES.UserHeaderBoard]: navigationOptionsHandler(UserHeaderBoard),
    [ROUTE_NAMES.SendConstant]: navigationOptionsHandler(SendConstant),
    [ROUTE_NAMES.Staking]: navigationOptionsHandler(Staking),
    [ROUTE_NAMES.Defragment]: navigationOptionsHandler(Defragment),
    [ROUTE_NAMES.NetworkSetting]: navigationOptionsHandler(NetworkSetting),
    [ROUTE_NAMES.CreateAccount]: navigationOptionsHandler(CreateAccount),
    [ROUTE_NAMES.ImportAccount]: navigationOptionsHandler(ImportAccount),
    [ROUTE_NAMES.SeedPhrase]: navigationOptionsHandler(SeedPhrase),
    [ROUTE_NAMES.ExportAccount]: navigationOptionsHandler(ExportAccount),
    [ROUTE_NAMES.CreateSendToken]: navigationOptionsHandler(CreateSendToken),
    [ROUTE_NAMES.FollowToken]: navigationOptionsHandler(FollowToken),
    [ROUTE_NAMES.HistoryToken]: navigationOptionsHandler(HistoryToken),
    [ROUTE_NAMES.WalletDetail]: navigationOptionsHandler(WalletDetail),
    [ROUTE_NAMES.ReceiveCrypto]: navigationOptionsHandler(ReceiveCrypto),
    [ROUTE_NAMES.SendCrypto]: navigationOptionsHandler(SendCrypto),
    [ROUTE_NAMES.Deposit]: navigationOptionsHandler(Deposit),
    [ROUTE_NAMES.Withdraw]: navigationOptionsHandler(Withdraw),
  },
  {
    initialRouteName: 'TabNavigator',
    defaultNavigationOptions: ({ navigation }) => {
      const handleUserPress = () => {
        navigation.navigate(ROUTE_NAMES.UserHeaderBoard);
      };

      return {
        headerRight: <UserHeaderContainer onPress={handleUserPress} />,
        headerTintColor: THEME.header.headerTintColor,
        headerStyle: {
          backgroundColor: THEME.header.backgroundColor
        }
      };
    }
  }
);

export default AppNavigator;
