import { Toast } from '@src/components/core';
import HistoryItem from '@src/components/HistoryItem';
import LoadingContainer from '@src/components/LoadingContainer';
import { loadHistoryByAccount } from '@src/services/wallet/WalletService';
import formatUtil from '@src/utils/format';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import tokenData from '@src/constants/tokenData';

const normalizeData = histories =>
  histories &&
  histories.map(h => ({
    txID: h?.txID,
    time: formatUtil.formatDateTime(h?.time),
    receiver: h?.receivers[0],
    amountAndSymbol: `${formatUtil.amount(h?.amount, tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY)} ${
      tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY
    }`,
    fee: formatUtil.amount(h?.fee),
    status: h?.status
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
    const { defaultAccount: { name } = {}, wallet } = this.props;
    this.loadAccountHistory(wallet, name);
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

    return <HistoryItem histories={normalizeData(histories)} />;
  }
}

const mapState = state => ({
  wallet: state.wallet,
  defaultAccount: state.account?.defaultAccount
});

MainCryptoHistory.propTypes = {
  wallet: PropTypes.objectOf(PropTypes.object),
  defaultAccount: PropTypes.objectOf(PropTypes.object)
};

export default connect(mapState)(MainCryptoHistory);
