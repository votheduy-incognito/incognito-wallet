import { Toast } from '@src/components/core';
import LoadingContainer from '@src/components/LoadingContainer';
import { getBalance } from '@src/redux/actions/account';
import scheduleService from '@src/services/schedule';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Home from './Home';

const HomeContainer = ({
  defaultAccount,
  getBalance,
  isGettingBalance,
  accounts,
  ...otherProps
}) => {
  const loadBalance = account => {
    if (account?.name) {
      getBalance(account).catch(() => {
        Toast.showError('Error while loading account balance');
      });
    }
  };

  useEffect(() => {
    const unsubcribe = scheduleService.reloadAllAccountBalance({
      accounts,
      getBalance,
      timeout: 300000
    });
    return () => {
      unsubcribe();
    };
  }, []);

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
      {...otherProps}
    />
  );
};

const mapState = state => {
  const account = state.account;
  return {
    accounts: account.list || [],
    defaultAccount: account.defaultAccount,
    isGettingBalance: account.isGettingBalance.includes(
      account.defaultAccount?.name
    )
  };
};

HomeContainer.propTypes = {
  accounts: PropTypes.objectOf(PropTypes.array),
  defaultAccount: PropTypes.objectOf(PropTypes.object),
  isGettingBalance: PropTypes.bool,
  getBalance: PropTypes.func
};

const mapDispatch = { getBalance };

export default connect(
  mapState,
  mapDispatch
)(HomeContainer);
