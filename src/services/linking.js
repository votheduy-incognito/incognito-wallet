import { Linking } from 'react-native';
import { Toast } from '@src/components/core';

const LinkingService = {
  openUrl(url) {
    try {
      if (url && typeof url === 'string') {
        Linking.canOpenURL(url).then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            throw new Error('This URL is not supported');
          }
        });
      } else {
        throw new Error('URL must be string');
      }
    } catch {
      Toast.showError('Can not open this URL, please try again');
    }
  },
};

export default LinkingService;