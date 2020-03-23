import React from 'react';
import {Dimensions, PixelRatio, Platform} from 'react-native';
import FloatButton from '@src/components/FloatButton';
import AppUpdater from '@components/AppUpdater/index';
import LinkingService from '@src/services/linking';
import {isIOS, isAndroid} from '@utils/platform';
import deviceInfo from 'react-native-device-info';

export default function Feedback() {
  const sendFeedback = async () => {
    const buildVersion = AppUpdater.appVersion;
    const title = `Incognito wallet ${buildVersion} ${isIOS() ? 'iOS' : 'Android'} feedback`;
    const { width, height } = Dimensions.get('window');
    const deviceInfomation = `${await deviceInfo.getModel()}, OS version ${Platform.Version}, screen size: ${PixelRatio.getPixelSizeForLayoutSize(height)}x${PixelRatio.getPixelSizeForLayoutSize(width)}`;
    const email = 'go@incognito.org';
    let content = `\n\n\n\n***\nLet the wallet team know your thoughts in as much detail as possible. Thanks for helping us build a better product!\n***\n\n${deviceInfomation}\n\nThanks for your support!\nIncognito mobile team.`;
    
    // almost Android devices are using Gmail, so use html template as default on Android
    if (isAndroid()) {
      content = content.replace(/\n/g, '<br/>');
    }

    LinkingService.openUrl(`mailto:${email}?subject=${title}&body=${content}`);
  };
  
  return (<FloatButton onPress={sendFeedback} label='Feedback' />);
}