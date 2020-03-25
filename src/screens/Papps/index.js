import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import routeNames from '@src/router/routeNames';
import Papps from './Papps';
import SearchForm from './SearchForm';

class PappsContainer extends PureComponent {
  constructor(props) {
    super(props);
  }

  static navigationOptions({navigation}) {
    const { onGo } = navigation.state.params || {};
    return {
      customHeader: <SearchForm onGo={onGo} />,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation?.setParams({onGo: this.onGo});
  }

  onGo = (pApp = {}) => {
    const { name, url } = pApp;
    const { navigation } = this.props;
    
    navigation?.navigate(routeNames.pApp, { url, appName: name ?? url});
  }

  render() {
    return (
      <Papps
        {...this.props}
        onGo={this.onGo}
      />
    );
  }
}

PappsContainer.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default PappsContainer;