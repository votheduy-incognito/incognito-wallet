import { Toast, ScrollView, RefreshControl } from '@src/components/core';
import HistoryList from '@src/components/HistoryList';
import LoadingContainer from '@src/components/LoadingContainer';
import { loadHistoryByAccount } from '@src/services/wallet/WalletService';
import PropTypes from 'prop-types';
import { CONSTANT_COMMONS } from '@src/constants';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { accountSeleclor } from '@src/redux/selectors';
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
    const { navigation } = this.props;
    this.handleLoadHistory();

    navigation.addListener(
      'didFocus',
      () => {
        this.handleLoadHistory();
      }
    );
  }

  componentDidUpdate(prevProps) {
    const { defaultAccount: { name } = {} } = this.props;
    const { defaultAccount: { name: prevName } = {} } = prevProps;
    if (prevName !== name) {
      this.this.handleLoadHistory();
    }
  }

  handleLoadHistory = () => {
    const { defaultAccount: { name } = {}, wallet, onLoad } = this.props;
    this.loadAccountHistory(wallet, name);

    if (typeof onLoad === 'function') {
      onLoad();
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

    return (
      <ScrollView
        refreshControl={(
          <RefreshControl
            refreshing={isLoading}
            onRefresh={this.handleLoadHistory}
          />
        )}
      >
        <HistoryList histories={normalizeData(histories)} />
      </ScrollView>
    );
  }
}

const mapState = state => ({
  wallet: state.wallet,
  defaultAccount: accountSeleclor.defaultAccount(state),
});

MainCryptoHistory.defaultProps = {
  onLoad: null
};

MainCryptoHistory.propTypes = {
  wallet: PropTypes.object.isRequired,
  defaultAccount: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  onLoad: PropTypes.func,
};

export default connect(mapState)(MainCryptoHistory);
