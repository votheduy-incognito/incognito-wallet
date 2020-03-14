import codePush from 'react-native-code-push';
import AppScreen from '@src/components/AppScreen';
import {StatusBar, Toast} from '@src/components/core';
import DeviceLog from '@src/components/DeviceLog';
import QrScanner from '@src/components/QrCodeScanner';
import configureStore from '@src/redux/store';
import AppContainer from '@src/router';
import ROUTE_NAMES from '@src/router/routeNames';
import {CustomError, ErrorCode, ExHandler} from '@src/services/exception';
import {initFirebaseNotification} from '@src/services/firebase';
import React, {PureComponent} from 'react';
import 'react-native-console-time-polyfill';
import {Provider} from 'react-redux';
import AppUpdater from '@components/AppUpdater/index';
import {PersistGate} from 'redux-persist/integration/react';

const isShowDeviceLog = false;
const {store, persistor} = configureStore();
const codePushOptions = {checkFrequency: codePush.CheckFrequency.MANUAL};

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
    currentScreen: ROUTE_NAMES.Wizard,
  };

  componentDidMount() {
    initFirebaseNotification()
      .then(() => {
        console.log('Firebase notification worked');
      })
      .catch(e => {
        __DEV__ &&
          new ExHandler(
            new CustomError(ErrorCode.firebase_init_failed, {rawError: e}),
          ).showErrorToast();
      });
  }

  render() {
    const {currentScreen} = this.state;
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar currentScreen={currentScreen} />
          <AppScreen>
            <AppContainer
              onNavigationStateChange={(prevState, currentState) => {
                const currentScreen = getActiveRouteName(currentState);
                this.setState({currentScreen});
                console.debug('CurrentScreen', currentScreen);
              }}
            />
            {isShowDeviceLog && <DeviceLog />}
            <AppUpdater />
            <QrScanner />
            <Toast />
          </AppScreen>
        </PersistGate>
      </Provider>
    );
  }
}

export default codePush(codePushOptions)(App);
