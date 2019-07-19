import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { accountSeleclor } from '@src/redux/selectors';
import Defragment from './Defragment';

const DefragmentContainer = ({ wallet, defaultAccount, ...otherProps }) => (
  <Defragment wallet={wallet} account={defaultAccount} {...otherProps} />
);

const mapState = state => ({
  defaultAccount: accountSeleclor.defaultAccount(state),
  wallet: state.wallet
});

DefragmentContainer.propTypes = {
  defaultAccount: PropTypes.objectOf(PropTypes.object),
  wallet: PropTypes.objectOf(PropTypes.object)
};

export default connect(mapState)(DefragmentContainer);
