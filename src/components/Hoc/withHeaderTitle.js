import React from 'react';
import {withNavigation} from 'react-navigation';
import {compose} from 'recompose';

const enhanceNavigation = WrappedComponent =>
  class extends React.Component {
    constructor(props) {
      super(props);
    }
    static navigationOptions = ({navigation}) => {
      return {
        title: navigation.getParam('headerTitle'),
      };
    };
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

export default compose(withNavigation, enhanceNavigation);
