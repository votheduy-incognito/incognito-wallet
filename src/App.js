// import 'intl';
// import 'intl/locale-data/jsonp/en';
import AppScreen from '@src/components/AppScreen';
import { Toast } from '@src/components/core';
import QrScanner from '@src/components/QrCodeScanner';
import configureStore from '@src/redux/store';
import AppContainer from '@src/router';
import { initFirebaseNotification } from '@src/services/firebase';
import React, { PureComponent } from 'react';
import { StatusBar } from 'react-native';
import 'react-native-console-time-polyfill';
import { ExHandler, CustomError, ErrorCode } from '@src/services/exception';
import { Provider } from 'react-redux';
import BalanceNotification from '@src/services/balanceNotification';
import { THEME } from './styles';



StatusBar.setBackgroundColor(THEME.statusBar.backgroundColor);

const store = configureStore();

class App extends PureComponent {
  componentDidMount() {
    initFirebaseNotification()
      .then(() => {
        console.log('Firebase notification worked');
        new BalanceNotification({ id: 'balance_alert' }).startSchedule();
      })
      .catch(() => {
        new ExHandler(new CustomError(ErrorCode.firebase_init_failed)).showErrorToast();
      });
  }

  render() {
    return (
      <Provider store={store}>
        <AppScreen>
          <AppContainer />
          <QrScanner />
          <Toast />
        </AppScreen>
      </Provider>
    );
  }
}

export default App;
