import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toast } from '@src/components/core';
import LoadingContainer from '@src/components/LoadingContainer';
import { getBalance as getAccountBalance } from '@src/redux/actions/account';
import { setBulkToken, getBalance, setDefaultToken } from '@src/redux/actions/token';
import scheduleService from '@src/services/schedule';
import accountService from '@src/services/wallet/accountService';

import { connect } from 'react-redux';
import Home from './Home';

class HomeContainer extends Component {
  componentDidMount() {
    const { account } = this.props;
    this.getFollowingToken();
    this.getAccountBalance(account);

    scheduleService.reloadAllAccountBalance();
  }

  getTokenBalance = token => {
    const { getBalance } = this.props;
    getBalance(token);
  }

  getAccountBalance = account => {
    const { getAccountBalance } = this.props;
    getAccountBalance(account);
  }

  getFollowingToken = async () => {
    try {
      const { account, wallet, setBulkToken } = this.props;
      const tokens = accountService.getFollowingTokens(account, wallet);
      tokens.forEach(this.getTokenBalance);
      setBulkToken(tokens);
    } catch {
      Toast.showError('Can not get list token for this account');
    }
  }

  handleSelectToken = (token) => {
    if (!token) return;

    alert(token.symbol);
  }

  render() {
    const { wallet, account, tokens, isGettingBalanceList } = this.props;

    if (!wallet) return <LoadingContainer />;

    return (
      <Home
        account={account}
        tokens={tokens}
        isGettingBalanceList={isGettingBalanceList}
        onSelectToken={this.handleSelectToken}
      />
    );
  }
}

const mapState = state => ({
  account: state.account.defaultAccount,
  wallet: state.wallet,
  tokens: state.token.followed || [],
  isGettingBalanceList: [...state.account.isGettingBalance, ...state.token.isGettingBalance]
});

const mapDispatch = { setBulkToken, getBalance, getAccountBalance, setDefaultToken };

HomeContainer.propTypes = {
  account: PropTypes.object.isRequired,
  tokens: PropTypes.array.isRequired,
  isGettingBalanceList: PropTypes.array.isRequired,
  wallet: PropTypes.object.isRequired,
  setBulkToken: PropTypes.func.isRequired,
  getAccountBalance: PropTypes.func.isRequired,
  getBalance: PropTypes.func.isRequired,
  setDefaultToken: PropTypes.func.isRequired,
};


export default connect(
  mapState,
  mapDispatch
)(HomeContainer);
