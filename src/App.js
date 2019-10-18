// import 'intl';
// import 'intl/locale-data/jsonp/en';
import 'react-native-console-time-polyfill';
import AppScreen from '@src/components/AppScreen';
import { Toast } from '@src/components/core';
import QrScanner from '@src/components/QrCodeScanner';
import configureStore from '@src/redux/store';
import AppContainer from '@src/router';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import { initFirebaseNotification } from '@src/services/firebase';
import React, { PureComponent } from 'react';
import { StatusBar } from 'react-native';

import { Provider } from 'react-redux';
import { THEME } from './styles';

StatusBar.setBackgroundColor(THEME.statusBar.backgroundColor1);

const store = configureStore();
const whiteScreens = ['HomeMine', 'Game'];
const darkScreens = ['DetailDevice'];

// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

class App extends PureComponent {
  componentDidMount() {
    initFirebaseNotification()
      .then(() => {
        console.log('Firebase notification worked');
      })
      .catch(() => {
        new ExHandler(new CustomError(ErrorCode.firebase_init_failed)).showErrorToast();
      });
  }

  render() {
    return (
      <Provider store={store}>
        <AppScreen>
          <AppContainer
            onNavigationStateChange={(prevState, currentState) => {
              const currentScreen = getActiveRouteName(currentState);

              console.debug('CurrentScreen', currentScreen);

              if (whiteScreens.includes(currentScreen)) {
                StatusBar.setBackgroundColor(THEME.statusBar.backgroundColor2);
                StatusBar.setBarStyle('dark-content');
              } else if (darkScreens.includes(currentScreen)) {
                StatusBar.setBackgroundColor(THEME.statusBar.backgroundColor3);
                StatusBar.setBarStyle('light-content');
              } else {
                StatusBar.setBackgroundColor(THEME.statusBar.backgroundColor1);
                StatusBar.setBarStyle('light-content');
              }
            }}
          />
          <QrScanner />
          <Toast />
        </AppScreen>
      </Provider>
    );
  }
}

export default App;
