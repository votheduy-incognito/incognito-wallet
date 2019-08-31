import React, { Component } from 'react';
import { AppState } from 'react-native';
import Toast from 'react-native-easy-toast';
import  { scaleInApp} from '@src/styles/TextStyle';

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

  onResume = () => {};

  renderToastMessage = () => {
    return (
      <Toast
        style={{marginHorizontal:scaleInApp(20)}}
        position="center"
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
