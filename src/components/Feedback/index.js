import React from 'react';
import FloatButton from '@src/components/FloatButton';
import LinkingService from '@src/services/linking';

export default function Feedback (navigation) {
  const sendFeedback = async () => {
    // const buildVersion = AppUpdater.appVersion;
    // const { width, height } = Dimensions.get('window');
    // const deviceInfomation = `${await deviceInfo.getModel()}, OS version ${Platform.Version}, screen size: ${PixelRatio.getPixelSizeForLayoutSize(height)}x${PixelRatio.getPixelSizeForLayoutSize(width)}`;
    // const title = `Incognito wallet ${buildVersion} ${isIOS() ? 'iOS' : 'Android'} ${deviceInfomation} feedback`;
    // const email = 'go@incognito.org';
    // let content = 'Please include as much detail as possible. Thanks for your time!';
    navigation.navigate('Community');
  };

  return (<FloatButton onPress={sendFeedback} label='Feedback' />);
}