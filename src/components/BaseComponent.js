import { ExHandler } from '@src/services/exception';
import { Component } from 'react';
import { AppState } from 'react-native';
import { Toast } from './core';

export const TAG = 'BaseComponent';

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
const isTestConnect = true;
class BaseComponent extends Component {
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
  showLogConnect=(message)=>{
    isTestConnect && new ExHandler(new Error(message),message).showWarningToast();
  }
  onResume = () => {};


  showToastMessage = (text = '', callback?) => {
    if (text ) {
      Toast.showInfo(text);
    }
  };

  handleAppStateChange = nextAppState => {
    if (
      this.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // this.onResume();
      // console.log('App has come to the foreground!');
    }
    this.appState = nextAppState;
  };

  isForeground = () => {
    return (
      this.appState.match(/inactive|background/) &&
      AppState.currentState === 'active'
    );
  };

}

BaseComponent.propTypes = {};

BaseComponent.defaultProps = {};
export default BaseComponent;
