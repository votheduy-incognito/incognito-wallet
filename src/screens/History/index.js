import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadHistoryByAccount } from '@src/services/wallet/WalletService';
import LoadingContainer from '@src/components/LoadingContainer';
import History from './History';
import { Toast } from '@src/components/core';


class HistoryContainer extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      histories: []
    };
  }

  componentDidUpdate(prevProps) {
    const { defaultAccount: { name } = {}, wallet } = this.props;
    const { defaultAccount: { name : prevName } = {} } = prevProps;
    if (prevName !== name) {
      this.loadAccountHistory(wallet, name);
    }
  }

  loadAccountHistory = async (wallet, accountName) => {
    try {
      this.setState({ isLoading: true });
      if (!wallet) {
        throw new Error('Wallet is not exist to load history');
      }

      if (!accountName) {
        throw new Error('Account is not exist to load history');
      }

      const histories = await loadHistoryByAccount(wallet, accountName);
      this.setState({ histories });
    } catch {
      Toast.showError('Can not load history right now, please try later');
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { isLoading, histories } = this.state;

    if (isLoading) {
      return <LoadingContainer />;
    }

    return (
      <History histories={histories} />
    );
  }
}

const mapState = state => ({
  wallet: state.wallet,
  defaultAccount: state.account?.defaultAccount
});

HistoryContainer.propTypes = {
  wallet: PropTypes.object,
  defaultAccount: PropTypes.object,
};

export default connect(mapState)(HistoryContainer);