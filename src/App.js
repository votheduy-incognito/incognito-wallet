// import 'intl';
// import 'intl/locale-data/jsonp/en';
import QrScanner from '@src/components/QrCodeScanner';
import configureStore from '@src/redux/store';
import AppContainer from '@src/router';
import React from 'react';
import { ThemeProvider } from 'react-native-elements';
import { Provider } from 'react-redux';
import theme from './styles/theme';

const store = configureStore();
const MainContainer = props => {
  return (
    <ThemeProvider theme={theme}>
      <AppContainer {...props} />
    </ThemeProvider>
  );
};
const App = () => (
  <Provider store={store}>
    <AppContainer />
    <QrScanner />
  </Provider>
);

export default App;
