import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CreateSendToken from './CreateSendToken';

const CreateSendTokenContainer = ({ wallet, defaultAccount, navigation, ...otherProps}) => {
  const _isPrivacy = navigation.getParam('isPrivacy');
  const _isCreate = navigation.getParam('isCreate');
  const reloadListFollowToken = navigation.getParam('reloadListFollowToken');
  
  return <CreateSendToken wallet={wallet} account={defaultAccount} isPrivacy={_isPrivacy} isCreate={_isCreate} reloadListFollowToken={reloadListFollowToken} {...otherProps} />;
};

const mapState = state => ({
  defaultAccount: state.account.defaultAccount,
  wallet: state.wallet
});

CreateSendTokenContainer.propTypes = {
  defaultAccount: PropTypes.object,
  wallet: PropTypes.object,
  isPrivacy: PropTypes.bool,
  isCreate: PropTypes.bool,
  navigation: PropTypes.object
};

export default connect(mapState)(CreateSendTokenContainer);