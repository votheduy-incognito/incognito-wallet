import LoadingContainer from '@src/components/LoadingContainer';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { accountSeleclor } from '@src/redux/selectors';
import ExportAccount from './ExportAccount';

const ExportAccountContainer = ({ account, navigation }) => {
  account = account || navigation?.getParam('account');

  if (!account) {
    return <LoadingContainer />;
  }

  return <ExportAccount account={account} />;
};

ExportAccountContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired
};

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state)
});

export default connect(mapState)(ExportAccountContainer);
