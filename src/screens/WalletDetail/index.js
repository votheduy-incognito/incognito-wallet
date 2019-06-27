import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBalance } from '@src/redux/actions/account';
import WalletDetail from './WalletDetail';
import LoadingContainer from '@src/components/LoadingContainer';

const WalletDetailContainer = ({ wallet, defaultAccount, selectedPrivacy, navigation, ...otherProps}) => (
  selectedPrivacy ? 
    <WalletDetail wallet={wallet} account={defaultAccount} selectedPrivacy={selectedPrivacy} navigation={navigation} {...otherProps} /> :
    <LoadingContainer />
);

const mapState = state => ({
  defaultAccount: state.account.defaultAccount,
  wallet: state.wallet,
  selectedPrivacy: state.selectedPrivacy
});

const mapDispatch = { getBalance };

WalletDetailContainer.defaultProps = {
  selectedPrivacy: null
};

WalletDetailContainer.propTypes = {
  selectedPrivacy: PropTypes.object,
  defaultAccount: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
};

export default connect(mapState, mapDispatch)(WalletDetailContainer);