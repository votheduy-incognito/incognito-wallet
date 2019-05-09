import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBalance } from '@src/redux/actions/account';
import Home from './Home';

const HomeContainer = ({ defaultAccount, getBalance, isGettingBalance, ...otherProps }) => {
  useEffect(() => {
    defaultAccount?.name && getBalance(defaultAccount);
  }, [defaultAccount?.name]);

  return (
    <Home account={defaultAccount} {...otherProps} isGettingBalance={isGettingBalance} />
  );
};

const mapState = state => {
  const account = state.account;
  return ({
    defaultAccount: account.defaultAccount,
    isGettingBalance: account.isGettingBalance.includes(account.defaultAccount?.name)
  });
};

HomeContainer.propTypes = {
  defaultAccount: PropTypes.object,
  isGettingBalance: PropTypes.bool,
  getBalance: PropTypes.func
};

const mapDispatch = { getBalance };

export default connect(mapState, mapDispatch)(HomeContainer);