import LoadingContainer from '@src/components/LoadingContainer';
import PropTypes from 'prop-types';
import React from 'react';
import ExportAccount from './ExportAccount';

const ExportAccountContainer = ({ navigation }) => {
  const account = navigation?.getParam('account');

  if (!account) {
    return <LoadingContainer />;
  }

  return <ExportAccount account={account} />;
};

ExportAccountContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default ExportAccountContainer;
