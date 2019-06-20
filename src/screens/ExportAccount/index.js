import LoadingContainer from '@src/components/LoadingContainer';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import ExportAccount from './ExportAccount';

const ExportAccountContainer = ({ account, navigation }) => {
  account = account || navigation?.getParam('account');

  if (!account) {
    return <LoadingContainer />;
  }

  return <ExportAccount account={account} />;
};

ExportAccountContainer.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.object),
  account: PropTypes.objectOf(PropTypes.object)
};

const mapState = state => ({
  account: state.account?.defaultAccount
});

export default connect(mapState)(ExportAccountContainer);
