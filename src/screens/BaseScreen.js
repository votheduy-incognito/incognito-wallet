import Util from '@src/utils/Util';
import React, { Component } from 'react';
import { AppState } from 'react-native';
import Toast from 'react-native-easy-toast';

export const TAG = 'BaseScreen';

const callIfBackToThisRoute = (props, call) => {
  if (!props.navigation) {
    return undefined;
  }
  const thisRoute = props.navigation.state.routeName;
  const listener = props.navigation.addListener('willFocus', payload => {
    if (payload.state.routeName === thisRoute) call(props);
  });
  return listener;
};
class BaseScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.subs = [];
    this.appState = AppState.currentState;
  }

  componentDidMount() {
    this.subs = [callIfBackToThisRoute(this.props, props => this.onResume())];

    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    this.subs?.forEach(sub => sub?.remove());
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  onResume = () => {};

  renderToastMessage = () => {
    return (
      <Toast
        position="top"
        ref={toast => {
          this.toast = toast;
        }}
      />
    );
  };

  showToastMessage = (text = '', callback = null) => {
    if (text && this.toast) {
      this.toast.show(text, 500, callback);
    }
  };

  handleAppStateChange = nextAppState => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.onResume();
      console.log('App has come to the foreground!');
    }
    this.appState = nextAppState;
  };

  isForeground = () => {
    return (
      this.appState.match(/inactive|background/) &&
      AppState.currentState === 'active'
    );
  };

  onPressBack = () => {
    const { navigation } = this.props;
    navigation?.goBack();
  };

  replaceScreen = (routeName, params = {}) => {
    const { navigation } = this.props;
    Util.resetRoute(navigation, routeName, params);
  };

  goToScreen = (routeName, params = {}) => {
    const { navigation } = this.props;
    navigation?.navigate(routeName, params);
  };
}

BaseScreen.propTypes = {};

BaseScreen.defaultProps = {};
export default BaseScreen;
