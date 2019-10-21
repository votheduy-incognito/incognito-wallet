// import 'intl';
// import 'intl/locale-data/jsonp/en';
import 'react-native-console-time-polyfill';
import AppScreen from '@src/components/AppScreen';
import { Toast, StatusBar } from '@src/components/core';
import QrScanner from '@src/components/QrCodeScanner';
import configureStore from '@src/redux/store';
import AppContainer from '@src/router';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import { initFirebaseNotification } from '@src/services/firebase';
import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';

const store = configureStore();

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
  state = {
    currentScreen: '',
  };

  componentDidMount() {
    initFirebaseNotification()
      .then(() => {
        console.log('Firebase notification worked');
      })
      .catch((e) => {
        new ExHandler(new CustomError(ErrorCode.firebase_init_failed, { rawError: e })).showErrorToast();
      });
  }

  render() {
    const { currentScreen } = this.state;
    return (
      <Provider store={store}>
        <StatusBar currentScreen={currentScreen} />
        <AppScreen>
          <AppContainer
            onNavigationStateChange={(prevState, currentState) => {
              const currentScreen = getActiveRouteName(currentState);
              this.setState({ currentScreen });
              console.debug('CurrentScreen', currentScreen);
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
