import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { BIG_COINS } from '@screens/Dex/constants';
import { CONSTANT_EVENTS } from '@src/constants';
import { logEvent } from '@services/firebase';
import { useSelector } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import LinkingService from '@src/services/linking';
import AppUpdater from '@components/AppUpdater/index';
import { isIOS } from '@utils/platform';
import deviceInfo from 'react-native-device-info';
import { Dimensions, PixelRatio, Platform } from 'react-native';
import { featuresSelector } from '@screens/Home/Home.selector';
import Toast from '@components/core/Toast/Toast';
import useFeatureConfig from '@src/shared/hooks/featureConfig';

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

const enhance = WrappedComp => props => {
  const navigation = useNavigation();

  const goToScreen = (route, params, event) => {
    navigation.navigate(route, params);
    if (event) {
      logEvent(event);
    }
  };
  const interactionById = item => {
    switch (item.key) {
    case 'buy_prv':
      goToScreen(
          item?.route || '',
          {
            inputTokenId: BIG_COINS.USDT,
            outputTokenId: BIG_COINS.PRV,
            outputValue: 1750e9,
          },
          CONSTANT_EVENTS.CLICK_HOME_BUY,
      );
      break;
    case 'trade':
      goToScreen(item?.route || '', {}, CONSTANT_EVENTS.CLICK_HOME_TRADE);
      break;
    case 'feedback':
      sendFeedback();
      break;
    case 'explorer':
      goToScreen('pApp', {url: item?.route});
      break;
    default:
      goToScreen(item?.route || '');
      break;
    }
  };

  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, interactionById }} />
    </ErrorBoundary>
  );
};

export default enhance;
