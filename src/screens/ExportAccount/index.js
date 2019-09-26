import LoadingContainer from '@src/components/LoadingContainer';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ExportAccount from './ExportAccount';

class ExportAccountContainer extends PureComponent {
  state = { account: null };

  componentDidMount() {
    this.loadAccount();
  }

  loadAccount = () => {
    const { navigation } = this.props;
    const account = navigation?.getParam('account');
    this.setState({ account });
    this.setTitle(account?.name ? `${account?.name}'s keys` : 'Your keys');
  }

  setTitle = (title) => {
    const { navigation } = this.props;
    navigation.setParams({
      title: title
    });
  }

  render() {
    const { account } = this.state;

    if (!account) {
      return <LoadingContainer />;
    }
  
    return <ExportAccount account={account} />;
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
