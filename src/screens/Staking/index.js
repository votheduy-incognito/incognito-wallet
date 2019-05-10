import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Staking from './Staking';

const StakingContainer = ({ wallet, defaultAccount, ...otherProps}) => (
  <Staking wallet={wallet} account={defaultAccount}  {...otherProps} />
);

const mapState = state => ({
  defaultAccount: state.account.defaultAccount,
  wallet: state.wallet,
});

StakingContainer.propTypes = {
  defaultAccount: PropTypes.object,
  wallet: PropTypes.object,
};

export default connect(mapState)(StakingContainer);