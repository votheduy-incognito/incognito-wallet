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
    const { width, height } = Dimensions.get('window');
    const deviceInfomation = `${await deviceInfo.getModel()}, OS version ${Platform.Version}, screen size: ${PixelRatio.getPixelSizeForLayoutSize(height)}x${PixelRatio.getPixelSizeForLayoutSize(width)}`;
    const title = `Incognito wallet ${buildVersion} ${isIOS() ? 'iOS' : 'Android'} ${deviceInfomation} feedback`;
    const email = 'go@incognito.org';
    let content = 'Please include as much detail as possible. Thanks for your time!';
    

    LinkingService.openUrl(`mailto:${email}?subject=${title}&body=${content}`);
  };
  
  return (<FloatButton onPress={sendFeedback} label='Feedback' />);
}