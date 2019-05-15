/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Provider } from 'react-redux';
import AppContainer from '@src/router';
import configureStore from '@src/redux/store';
import QrScanner from '@src/components/QrCodeScanner';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <AppContainer />
    <QrScanner />
  </Provider>
);

export default App;
