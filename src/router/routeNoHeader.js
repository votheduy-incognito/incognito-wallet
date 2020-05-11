import { navigationOptionsHandler } from '@src/utils/router';
import WhyShield from '@src/screens/Shield/features/WhyShield';
import SelectAccount from '@screens/SelectAccount';
import Home from '@src/screens/Home';
import Wallet from '@src/screens/Wallet/features/Home';
import Community from '@src/screens/Community';
import CreateToken from '@src/screens/CreateToken';
import Stake from '@screens/Stake';
import Shield from '@screens/Shield';
import ShieldGenQRCode from '@screens/Shield/features/GenQRCode';
import routeNames from './routeNames';

const routes = [
  {
    screen: WhyShield,
    name: routeNames.WhyShield,
  },
  {
    screen: SelectAccount,
    name: routeNames.SelectAccount,
  },
  {
    screen: Home,
    name: routeNames.Home,
  },
  {
    screen: Wallet,
    name: routeNames.Wallet,
  },
  {
    screen: Community,
    name: routeNames.Community,
  },
  {
    screen: Shield,
    name: routeNames.Shield,
  },
  {
    screen: CreateToken,
    name: routeNames.CreateToken,
  },
  {
    screen: Stake,
    name: routeNames.Stake,
  },
  {
    screen: ShieldGenQRCode,
    name: routeNames.ShieldGenQRCode,
  },
];

export const getRoutesNoHeader = () =>
  routes.reduce((result, route) => {
    result[(route?.name)] = navigationOptionsHandler(route?.screen, {
      header: () => null,
    });
    return result;
  }, {});
