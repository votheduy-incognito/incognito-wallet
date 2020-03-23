import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import routeNames from '@src/router/routeNames';
import { ExHandler, CustomError, ErrorCode } from '@src/services/exception';
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

  urlValidator = (url) => {
    // eslint-disable-next-line
    if (!(/(http(s)?:\/\/)./g.test(url))) throw new CustomError(ErrorCode.paaps_invalid_daap_url);
    return true;
  }

  onGo = (pApp = {}) => {
    try {
      const { name, url } = pApp;

      if (this.urlValidator(url)) {
        const { navigation } = this.props;
        navigation?.navigate(routeNames.pApp, { url, appName: name ?? url });
      }
    } catch (e) {
      new ExHandler(e, 'Sorry, we can not open this Papp.').showErrorToast();
    }
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