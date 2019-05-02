import RNToast from 'react-native-root-toast';
import { THEME } from '@src/styles';

const STYLES = {
  ERROR: {
    backgroundColor: THEME.toast.error.backgroundColor,
    textColor: THEME.toast.error.textColor
  },
  INFO: {
    backgroundColor: THEME.toast.info.backgroundColor,
    textColor: THEME.toast.info.textColor
  },
  WARNING: {
    backgroundColor: THEME.toast.warning.backgroundColor,
    textColor: THEME.toast.warning.textColor
  }
};

class Toast extends RNToast {
  static show(msg, config) {
    return super.show(msg, {
      position: RNToast.positions.BOTTOM,
      duration: RNToast.durations.SHORT,
      ...config,
    });
  }

  static showInfo(msg, config) {
    return Toast.show(msg, {
      ...config,
      ...STYLES.INFO 
    });
  }

  static showWarning(msg, config) {
    return Toast.show(msg, {
      ...config,
      ...STYLES.WARNING
    });
  }

  static showError(msg, config) {
    return Toast.show(msg, {
      ...config,
      ...STYLES.ERROR
    });
  }
}

export default Toast;