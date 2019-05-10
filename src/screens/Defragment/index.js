import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Defragment from './Defragment';

const DefragmentContainer = ({ wallet, defaultAccount, ...otherProps}) => (
  <Defragment wallet={wallet} account={defaultAccount}  {...otherProps} />
);

const mapState = state => ({
  defaultAccount: state.account.defaultAccount,
  wallet: state.wallet,
});

DefragmentContainer.propTypes = {
  defaultAccount: PropTypes.object,
  wallet: PropTypes.object,
};

export default connect(mapState)(DefragmentContainer);