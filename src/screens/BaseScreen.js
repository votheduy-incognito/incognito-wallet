import BaseComponent from '@src/components/BaseComponent';
import Util from '@src/utils/Util';
import { AppState } from 'react-native';
// import deviceLog, { InMemoryAdapter } from 'react-native-device-log';

// export const TAG = 'BaseScreen';
// deviceLog.init(new InMemoryAdapter()
//   ,{
//     logToConsole : false,
//     logRNErrors : true,
//     maxNumberToRender : 2000,
//     maxNumberToPersist : 2000
//   }).then(() => {
//   deviceLog.clear();
// });

// deviceLog.startTimer(`${TAG}-start-up`);

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
    navigation?.navigate(routeName, { ...params, goBackKey: navigation.state.key });
  };
}

BaseScreen.propTypes = {};

BaseScreen.defaultProps = {};
export default BaseScreen;
