import React from 'react';
import {Dimensions, PixelRatio, Platform} from 'react-native';
import FloatButton from '@src/components/FloatButton';
import AppUpdater from '@components/AppUpdater/index';
import LinkingService from '@src/services/linking';
import {isIOS} from '@utils/platform';
import deviceInfo from 'react-native-device-info';

export default function Feedback() {
  const sendFeedback = async () => {
    const buildVersion = AppUpdater.appVersion;
    const title = `Incognito wallet ${buildVersion} ${isIOS() ? 'iOS' : 'Android'} feedback`;
    const { width, height } = Dimensions.get('window');
    const deviceInfomation = `${await deviceInfo.getModel()}, OS version ${Platform.Version}, screen size: ${PixelRatio.getPixelSizeForLayoutSize(height)}x${PixelRatio.getPixelSizeForLayoutSize(width)}`;
    const content = `***\nPlease include as much info as possible.\n\n***\n\n${deviceInfomation}\n\nThanks for your support!\nIncognito mobile team.`;
    const email = 'go@incognito.org';
    LinkingService.openUrl(`mailto:${email}?subject=${title}&body=${content}`);
  };
  


  return (<FloatButton onPress={sendFeedback} label='Feedback' />);
}