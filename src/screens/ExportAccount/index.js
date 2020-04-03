import LoadingContainer from '@src/components/LoadingContainer';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {getToken} from '@services/firebase';
import ExportAccount from './ExportAccount';

class ExportAccountContainer extends PureComponent {
  state = { account: null, token: '' };

  componentDidMount() {
    this.loadAccount();
    this.loadDeviceToken();
  }

  loadDeviceToken = async () => {
    const token = await getToken();

    this.setState({token});
  };

  loadAccount = () => {
    const { navigation } = this.props;
    const account = navigation?.getParam('account');
    this.setState({ account });
    this.setTitle(account?.name ? `${account?.name}'s keys` : 'Your keys');
  };

  setTitle = (title) => {
    const { navigation } = this.props;
    navigation.setParams({
      title: title
    });
  };

  render() {
    const {
      account,
      token,
    } = this.state;

    if (!account) {
      return <LoadingContainer />;
    }

    return <ExportAccount account={account} token={token} />;
  }
}

ExportAccountContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
};

ExportAccountContainer.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.state.params?.title,
  };
};

export default ExportAccountContainer;
