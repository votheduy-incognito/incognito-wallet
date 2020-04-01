import React from 'react';
import {withNavigation} from 'react-navigation';
import {compose} from 'recompose';

const enhanceNavigation = WrappedComponent =>
  class extends React.Component {
    constructor(props) {
      super(props);
    }
    static navigationOptions = ({navigation}) => {
      const navigationOptions = navigation.getParam('navigationOptions');
      return navigationOptions;
    };
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

export default compose(withNavigation, enhanceNavigation);
