import Util from '@src/utils/Util';
import React from 'react';
import { AppState } from 'react-native';
import Toast from 'react-native-easy-toast';
import BaseComponent from '@src/components/BaseComponent';

export const TAG = 'BaseScreen';

class BaseScreen extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading:false
    };
    this.subs = [];
    this.appState = AppState.currentState;
  }

  set Loading(isLoading){
    this.setState({
      loading:isLoading
    });
  }
  get isLoading(){
    return this.state.loading||false;
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }

  onResume = () => {};

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
