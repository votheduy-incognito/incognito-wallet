// import 'intl';
// import 'intl/locale-data/jsonp/en';
import QrScanner from '@src/components/QrCodeScanner';
import configureStore from '@src/redux/store';
import AppContainer from '@src/router';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { initFirebaseNotification, onFirebaseMessage } from '@src/services/firebase';

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
      <AppContainer />
      <QrScanner />
    </Provider>
  );
};

export default App;
