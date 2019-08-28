// import 'intl';
// import 'intl/locale-data/jsonp/en';
import QrScanner from '@src/components/QrCodeScanner';
import configureStore from '@src/redux/store';
import AppContainer from '@src/router';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { initFirebaseNotification, onFirebaseMessage } from '@src/services/firebase';
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import { THEME } from './styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.header.backgroundColor,
    paddingTop: (Platform.OS === 'android' && DeviceInfo.hasNotch()) ? StatusBar.currentHeight : 0
  }
});

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
      <SafeAreaView style={styles.container} forceInset={{ bottom: 'never' }}>
        <AppContainer />
        <QrScanner />
      </SafeAreaView>
    </Provider>
  );
};

export default App;
