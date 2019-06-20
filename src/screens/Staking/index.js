import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Staking from './Staking';

const StakingContainer = ({ wallet, defaultAccount, ...otherProps }) => (
  <Staking wallet={wallet} account={defaultAccount} {...otherProps} />
);

const mapState = state => ({
  defaultAccount: state.account.defaultAccount,
  wallet: state.wallet
});
StakingContainer.defaultProps = {
  defaultAccount: undefined,
  wallet: undefined
};
StakingContainer.propTypes = {
  defaultAccount: PropTypes.objectOf(PropTypes.object),
  wallet: PropTypes.objectOf(PropTypes.object)
};

export default connect(mapState)(StakingContainer);
