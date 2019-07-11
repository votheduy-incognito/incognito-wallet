import { Toast } from '@src/components/core';
import HistoryList from '@src/components/HistoryList';
import LoadingContainer from '@src/components/LoadingContainer';
import { loadHistoryByAccount } from '@src/services/wallet/WalletService';
import PropTypes from 'prop-types';
import { CONSTANT_COMMONS } from '@src/constants';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import tokenData from '@src/constants/tokenData';

const normalizeData = histories =>
  histories &&
  histories.map(h => ({
    id: h?.txID,
    time: h?.time,
    type: CONSTANT_COMMONS.HISTORY.TYPE.SEND,
    toAddress: h?.receivers[0],
    amount: h?.amount,
    symbol: tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY,
    statusCode: h?.status
  }));

class MainCryptoHistory extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      histories: []
    };
  }

  componentDidMount() {
    const { defaultAccount: { name } = {}, wallet, navigation } = this.props;
    this.loadAccountHistory(wallet, name);

    navigation.addListener(
      'didFocus',
      () => {
        this.loadAccountHistory(wallet, name);
      }
    );
  }

  componentDidUpdate(prevProps) {
    const { defaultAccount: { name } = {}, wallet } = this.props;
    const { defaultAccount: { name: prevName } = {} } = prevProps;
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
  };

  render() {
    const { isLoading, histories } = this.state;

    if (isLoading) {
      return <LoadingContainer />;
    }

    return <HistoryList histories={normalizeData(histories)} />;
  }
}

const mapState = state => ({
  wallet: state.wallet,
  defaultAccount: state.account?.defaultAccount
});

MainCryptoHistory.propTypes = {
  wallet: PropTypes.object.isRequired,
  defaultAccount: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default connect(mapState)(MainCryptoHistory);
