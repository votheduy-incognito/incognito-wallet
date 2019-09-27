// import 'intl';
// import 'intl/locale-data/jsonp/en';
import AppScreen from '@src/components/AppScreen';
import { Toast } from '@src/components/core';
import QrScanner from '@src/components/QrCodeScanner';
import configureStore from '@src/redux/store';
import AppContainer from '@src/router';
import { initFirebaseNotification, onFirebaseMessage } from '@src/services/firebase';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import 'react-native-console-time-polyfill';
import { Provider } from 'react-redux';
import { THEME } from './styles';

StatusBar.setBackgroundColor(THEME.statusBar.backgroundColor);

const store = configureStore();

const App = () => {
  useEffect(() => {
    initFirebaseNotification()
      .then(() => {
        console.log('Firebase notification worked');
        onFirebaseMessage(data => {
          console.log('firebase msg', data);
        });
      })
      .catch(e => {
        console.error(e);
      });
  }, []);

  return (
    <Provider store={store}>
      <AppScreen>
        <AppContainer />
        <QrScanner />
        <Toast />
      </AppScreen>
    </Provider>
  );
};

export default App;
