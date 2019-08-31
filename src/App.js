// import 'intl';
// import 'intl/locale-data/jsonp/en';
import QrScanner from '@src/components/QrCodeScanner';
import AppScreen from '@src/components/AppScreen';
import { Toast } from '@src/components/core';
import configureStore from '@src/redux/store';
import AppContainer from '@src/router';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { initFirebaseNotification, onFirebaseMessage } from '@src/services/firebase';
import { StatusBar } from 'react-native';
import { THEME } from './styles';

StatusBar.setBackgroundColor(THEME.header.backgroundColor);

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
