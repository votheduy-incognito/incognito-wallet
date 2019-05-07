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

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <AppContainer />
  </Provider>
);

export default App;
