import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBalance } from '@src/redux/actions/account';
import LoadingContainer from '@src/components/LoadingContainer';
import Home from './Home';

const HomeContainer = ({ defaultAccount, getBalance, isGettingBalance, ...otherProps }) => {
  const loadBalance = account =>  {
    if (account?.name) {
      getBalance(account);
    }
  };

  useEffect(() => {
    loadBalance(defaultAccount);
  }, [defaultAccount?.name]);

  if (!defaultAccount?.name) {
    return <LoadingContainer />;
  }

  return (
    <Home
      account={defaultAccount}
      isGettingBalance={isGettingBalance}
      reloadBalance={() => loadBalance(defaultAccount)}
      {...otherProps} />
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