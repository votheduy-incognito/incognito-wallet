import { Clipboard } from 'react-native';
import { Toast } from '@src/components/core';

const ClipboardService = {
  set(str) {
    try {
      if (str && typeof str === 'string') {
        Clipboard.setString(str);
        Toast.showInfo('Copied');
      } else {
        throw new Error('Clipboard data must be string');
      }
    } catch {
      Toast.showError('Can not copy right now, try later');
    }
  },

  get() {
    return Clipboard.getString();
  }
};

export default ClipboardService;