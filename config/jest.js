/* eslint-disable */

// jest.mock('PushNotificationIOS', () => ({
//   addEventListener: jest.fn(),
//   requestPermissions: jest.fn(),
// }));

// jest.mock('react-native', () => ({
//   NetInfo: {
//     addEventListener: jest.fn(),
//     fetch: () => {
//       return {
//         done: jest.fn()
//       };
//     }
//   },
//   NativeModules: {
//     RNPasscodeStatus: {
//       supported: jest.fn(),
//       status: jest.fn(),
//       get: jest.fn()
//     }
//   },
//   Dimensions: {
//     get: () => ({
//       width: jest.fn(),
//       height: jest.fn()
//     })
//   },
//   StyleSheet: {
//     create: () => ({})
//   },
//   Platform: {
//
//   },
//   StatusBar: {
//
//   },
//   AppState: {},
//   Text: () => {
//     const React = require('react');
//     class Text extends React.Component {
//       render() {
//         console.log(this.props);
//         return React.createElement('div', this.props, this.props.children);
//       }
//     }
//     return Text;
//   },
//   View: () => {
//     const RealComponent = jest.requireActual('View');
//     const React = require('react');
//     class View extends React.Component {
//       render() {
//         console.log(this.props);
//         return React.createElement('div', this.props, this.props.children);
//       }
//     }
//     View.propTypes = RealComponent.propTypes;
//     return View;
//   },
// }));
jest.mock('react-native-camera', () => {
});
jest.mock('react-native-easy-toast', () => {
});
jest.mock('react-native-vector-icons/MaterialIcons', () => {

});
jest.mock('react-native-reanimated', () => {

});

jest.mock('react-native-tab-view', () => ({
  TabView: class {

  },
  SceneMap: {

  },
}));
jest.mock('react-native-device-info', () => ({
  getTimezone: () => '',
  hasNotch: () => false,
}));

jest.mock('react-native-elements', () => ({
  CheckBox: {},
  Button: () => {
    const React = require('react');
    class Button extends React.Component {
      render() {
        console.log(this.props);
        return React.createElement('div', this.props, this.props.children);
      }
    }
    return Button;
  },
  Input: () => {
    const React = require('react');
    class Button extends React.Component {
      render() {
        console.log(this.props);
        return React.createElement('div', this.props, this.props.children);
      }
    }
    return Button;
  },
}));

jest.mock('@react-native-community/async-storage', () => ({
  getItem: () => 'getItem',
  setItem: () => 'setItem',
}));

jest.mock('react-native-popup-dialog', () => ({

}));
