import React, { useState } from 'react';
import {
  ScrollView,
  Dimensions,
  PixelRatio,
  Platform,
  TouchableWithoutFeedback,
  RefreshControl,
} from 'react-native';
import LinkingService from '@src/services/linking';
import AppUpdater from '@components/AppUpdater/index';
import { isIOS } from '@utils/platform';
import deviceInfo from 'react-native-device-info';
import PropTypes from 'prop-types';
import { View, Text } from '@src/components/core';
import IconTextButton from '@screens/Home/IconTextButton';
import { BIG_COINS } from '@screens/Dex/constants';
import { useSelector } from 'react-redux';
import accountSeleclor from '@src/redux/selectors/account';
import dexUtil from '@utils/dex';
import { CONSTANT_EVENTS } from '@src/constants';
import LocalDatabase from '@utils/LocalDatabase';
import { withdraw } from '@services/api/withdraw';
import { logEvent } from '@services/firebase';
import Tooltip from '@components/Tooltip';
import styles from './style';
import withHome from './Home.enhance';

const sendFeedback = async () => {
  const buildVersion = AppUpdater.appVersion;
  const { width, height } = Dimensions.get('window');
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

const tooltipType = '2';

const Home = ({ navigation }) => {
  const [buttons, setButtons] = useState([]);
  const [headerTitle, setHeaderTitle] = useState([]);
  const account = useSelector(accountSeleclor.defaultAccount);
  const [viewUniswap, setViewUniswap] = React.useState(undefined);

  const goToScreen = (route, params, event) => {
    navigation.navigate(route, params);

    if (event) {
      logEvent(event);
    }
  };

  const isDisabled = item => {
    if (item?.sortId === 'Send' && dexUtil.isDEXMainAccount(account.name)) {
      return true;
    }

    if (
      (item?.title === 'Receive' || item?.title === 'Shield') &&
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

  const getHomeConfiguration = () => {
    fetch('https://api-data.incognito.org/home-configs')
      .then((val) => val.json())
      .then(val => {
        if (val) {
          if (val?.buttons && Array.isArray(val.buttons)) {
            setButtons(val.buttons);
          }
          if (val?.headerTitle) {
            setHeaderTitle(val.headerTitle?.title && val.headerTitle?.title.replace('\\n', '\n') || '');
          }
        }
      })
      .catch(() => {
        console.log('Fetching configuration for home failed.');
      });
  };

  React.useEffect(() => {
    getHomeConfiguration();
    tryLastWithdrawal();
    getViewUniswap();

    navigation.addListener('didBlur', closeTooltip);
  }, []);
  const interactionById = (item) => {
    switch (item.sortId) {
    // Shield
    // Send
    // Receive
    case 1:
    case 3:
    case 4:
    case 5:
    case 8:
    case 10:
      goToScreen(item?.route || '');
      break;
      // Buy PRV
    case 2:
      goToScreen(item?.route || '', {
        inputTokenId: BIG_COINS.USDT,
        outputTokenId: BIG_COINS.PRV,
      }, CONSTANT_EVENTS.CLICK_HOME_BUY);
      break;
      // Issue a coin
    case 6:
      goToScreen(item?.route || '', {}, CONSTANT_EVENTS.CLICK_HOME_TRADE);
      break;
    case 7:
      LinkingService.openUrl(
        'https://node.incognito.org/payment.html?utm_source=app&utm_medium=homepage%20app&utm_campaign=pnode',
      );
      break;
    case 9:
      sendFeedback();
      break;
    default:
      break;
    }
  };

  return (
    <TouchableWithoutFeedback accessible={false} style={{ flex: 1 }} onPress={closeTooltip}>
      <ScrollView
        refreshControl={(
          <RefreshControl
            refreshing={false}
            onRefresh={() => { getHomeConfiguration(); }}
          />
        )}
      >
        <View>
          <Text numberOfLines={3} multiLine style={styles.titleHeader}>
            {headerTitle}
          </Text>
          <View style={styles.btnContainer}>
            {buttons.map(item => (
              <View style={styles.btn} key={item.id}>
                {item?.toolTip?.message != '' && item?.title === 'Stake PRV' && viewUniswap !== tooltipType && (
                  <Tooltip
                    title={item?.toolTip?.title || 'News'}
                    desc={item?.toolTip?.message || ''}
                    containerStyled={styles.tooltip}
                  />
                )}
                <IconTextButton
                  image={item.icoUrl}
                  title={item.title}
                  disabled={isDisabled(item)}
                  onPress={() => interactionById(item)}
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
