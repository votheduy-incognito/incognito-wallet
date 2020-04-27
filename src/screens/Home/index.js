import React from 'react';
import {
  ScrollView,
  Dimensions,
  PixelRatio,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import LinkingService from '@src/services/linking';
import AppUpdater from '@components/AppUpdater/index';
import {isIOS} from '@utils/platform';
import deviceInfo from 'react-native-device-info';
import PropTypes from 'prop-types';
import {View, Text} from '@src/components/core';
import icShield from '@assets/images/icons/ic_shield_btn.png';
import icSend from '@assets/images/icons/ic_send_btn.png';
import icReceive from '@assets/images/icons/ic_receive_btn.png';
import icTrade from '@assets/images/icons/ic_trade.png';
import icSetting from '@assets/images/icons/ic_setting_btn.png';
import icInvent from '@assets/images/icons/ic_invent_btn.png';
import icPower from '@assets/images/icons/ic_power.png';
import icBuy from '@assets/images/icons/ic_buy_prv.png';
import icFeedback from '@assets/images/icons/ic_feedback.png';
import icPapp from '@assets/images/icons/ic_papp.png';
import icKyber from '@assets/images/icons/ic_kyber.png';
import IconTextButton from '@screens/Home/IconTextButton';
import ROUTE_NAMES from '@routers/routeNames';
import {BIG_COINS} from '@screens/Dex/constants';
import {useSelector} from 'react-redux';
import accountSeleclor from '@src/redux/selectors/account';
import dexUtil from '@utils/dex';
import {CONSTANT_EVENTS} from '@src/constants';
import LocalDatabase from '@utils/LocalDatabase';
import {withdraw} from '@services/api/withdraw';
import {logEvent} from '@services/firebase';
import icStake from '@assets/images/icons/stake_icon.png';
import Tooltip from '@components/Tooltip';
import styles from './style';
import withHome from './Home.enhance';

const settingItem = {
  image: icSetting,
  title: 'Settings',
  desc: '',
  route: ROUTE_NAMES.Setting,
};
const sendItem = {
  image: icSend,
  title: 'Send',
  desc: 'Anonymously',
  route: ROUTE_NAMES.SendCrypto,
};
const receiveItem = {
  image: icReceive,
  title: 'Receive',
  desc: 'Anonymously',
  route: ROUTE_NAMES.ReceiveCoin,
};
const shieldItem = {
  image: icShield,
  title: 'Shield',
  desc: 'Your crypto',
  route: ROUTE_NAMES.Shield,
};

const pappItem = {
  image: icPapp,
  title: 'Browse',
  desc: 'Search URL',
  route: ROUTE_NAMES.pApps,
};

const powerItem = {
  image: icPower,
  title: 'Buy Node',
  desc: 'Plug & play',
  route: ROUTE_NAMES.Community,
  onPress: () => {
    LinkingService.openUrl(
      'https://node.incognito.org/payment.html?utm_source=app&utm_medium=homepage%20app&utm_campaign=pnode',
    );
  },
};
const sendFeedback = async () => {
  const buildVersion = AppUpdater.appVersion;
  const {width, height} = Dimensions.get('window');
  const deviceInfomation = `${await deviceInfo.getModel()}, OS version ${
    Platform.Version
  }, screen size: ${PixelRatio.getPixelSizeForLayoutSize(
    height,
  )}x${PixelRatio.getPixelSizeForLayoutSize(width)}`;
  const title = `Incognito wallet ${buildVersion} ${
    isIOS() ? 'iOS' : 'Android'
  } ${deviceInfomation} feedback`;
  const email = 'go@incognito.org';
  let content =
    'Please include as much detail as possible. Thanks for your time!';

  LinkingService.openUrl(`mailto:${email}?subject=${title}&body=${content}`);
};
const pUniswapItem = {
  image: icKyber,
  title: 'pKyber (testnet)',
  route: ROUTE_NAMES.pUniswap,
  event: CONSTANT_EVENTS.CLICK_HOME_UNISWAP,
};

const pStakeItem = {
  image: icStake,
  title: 'Stake PRV',
  route: ROUTE_NAMES.Stake,
};

const buttons = [
  shieldItem,
  {
    image: icBuy,
    title: 'Buy PRV',
    route: ROUTE_NAMES.Dex,
    params: {
      inputTokenId: BIG_COINS.USDT,
      outputTokenId: BIG_COINS.PRV,
    },
    event: CONSTANT_EVENTS.CLICK_HOME_BUY,
  },

  sendItem,
  receiveItem,
  {
    image: icInvent,
    title: 'Issue a coin',
    route: ROUTE_NAMES.CreateToken,
  },
  {
    image: icTrade,
    title: 'Trade',
    route: ROUTE_NAMES.Dex,
    event: CONSTANT_EVENTS.CLICK_HOME_TRADE,
  },
  powerItem,
  pStakeItem,
  // pUniswapItem,
  {
    image: icFeedback,
    title: 'Feedback',
    route: ROUTE_NAMES.Community,
    // params: {
    //   uri: 'https://incognito.org/c/help/45',
    // }
    onPress: () => sendFeedback(),
  },
  settingItem,
];

const tooltipType = '2';

const Home = ({navigation}) => {
  const account = useSelector(accountSeleclor.defaultAccount);
  const [viewUniswap, setViewUniswap] = React.useState(undefined);

  const goToScreen = (route, params, event) => {
    navigation.navigate(route, params);

    if (event) {
      logEvent(event);
    }
  };

  const isDisabled = item => {
    if (item === sendItem && dexUtil.isDEXMainAccount(account.name)) {
      return true;
    }

    if (
      (item === receiveItem || item === shieldItem) &&
      dexUtil.isDEXWithdrawAccount(account.name)
    ) {
      return true;
    }

    return false;
  };

  const tryLastWithdrawal = async () => {
    try {
      const txs = await LocalDatabase.getWithdrawalData();

      for (const tx in txs) {
        if (tx) {
          await withdraw(tx);
          await LocalDatabase.removeWithdrawalData(tx.burningTxId);
        }
      }
    } catch (e) {
      //
    }
  };

  const closeTooltip = () => {
    setViewUniswap(tooltipType);
  };

  const getViewUniswap = async () => {
    const viewUniswap = await LocalDatabase.getViewUniswapTooltip(tooltipType);
    setViewUniswap(viewUniswap);

    setTimeout(closeTooltip, 7000);
  };

  React.useEffect(() => {
    tryLastWithdrawal();
    getViewUniswap();

    navigation.addListener('didBlur', closeTooltip);
  }, []);

  return (
    <TouchableWithoutFeedback style={{flex: 1}} onPress={closeTooltip}>
      <ScrollView>
        <View>
          <Text numberOfLines={3} multiLine style={styles.titleHeader}>
            {'Incognito mode \nfor your crypto'}
          </Text>
          <View style={styles.btnContainer}>
            {buttons.map(item => (
              <View style={styles.btn} key={item.title}>
                {item === pStakeItem && viewUniswap !== tooltipType && (
                  <Tooltip
                    title="New"
                    desc="Join a PRV staking pool. Get 57% APY. Interest paid every second."
                    containerStyled={styles.tooltip}
                  />
                )}
                <IconTextButton
                  image={item.image}
                  title={item.title}
                  disabled={isDisabled(item)}
                  onPress={
                    item.onPress || (() => goToScreen(item.route, item.params))
                  }
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default withHome(Home);
