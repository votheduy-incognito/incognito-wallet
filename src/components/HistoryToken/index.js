import { ScrollView, Toast, RefreshControl } from '@src/components/core';
import HistoryList from '@src/components/HistoryList';
import LoadingContainer from '@src/components/LoadingContainer';
import tokenService from '@src/services/wallet/tokenService';
import { getpTokenHistory } from '@src/services/api/history';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { accountSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import { CONSTANT_COMMONS } from '@src/constants';

const combineHistory = (histories, historiesFromApi, symbol, externalSymbol, decimals, pDecimals) => {
  const data = [];

  historiesFromApi && historiesFromApi.forEach((h, index) => {
    data.push({
      id: h?.outsideChainTx || index,
      time: h?.updatedAt,
      type: h?.addressType,
      toAddress: h?.userPaymentAddress,
      fromAddress: h?.userPaymentAddress,
      amount: h?.incognitoAmount,
      requestedAmount: h?.requestedAmount,
      symbol: externalSymbol,
      decimals,
      pDecimals,
      status: h?.statusText,
      statusCode: h?.status
    });
  });

  histories && histories.forEach(h => {
    data.push({
      id: h?.txID,
      time: h?.time,
      type: h?.isIn ?  CONSTANT_COMMONS.HISTORY.TYPE.RECEIVE : CONSTANT_COMMONS.HISTORY.TYPE.SEND,
      toAddress: h?.receivers[0],
      amount: h?.amount,
      symbol: h?.tokenSymbol,
      decimals,
      pDecimals,
      status: h?.status
    });
  });

  return data.sort((a, b) => new Date(a.time).getTime() < new Date(b.time).getTime() ? 1 : -1);
};


class HistoryTokenContainer extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      histories: [],
      historiesFromApi: [],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
  
    navigation.addListener(
      'didFocus',
      () => {
        this.handleLoadHistory();
      }
    );
  }

  componentDidUpdate(prevProps) {
    const token = this.getToken(this.props);
    const prevToken = this.getToken(prevProps);

    if (token && (token?.id !== prevToken?.id)) {
      this.handleLoadHistory();
    }
  }

  handleLoadHistory = () => {
    const { wallet, defaultAccount, onLoad } = this.props;
    const token = this.getToken(this.props);
    this.loadTokentHistory(wallet, defaultAccount, token);
    this.getHistoryFromApi();

    if (typeof onLoad === 'function') {
      onLoad();
    }
  }

  getToken = (props) => {
    const { selectedPrivacy, tokens } = props;
    return tokens?.find(t => t?.id === selectedPrivacy?.tokenId);
  }

  getHistoryFromApi = async () => {
    try {
      this.setState({ isLoading: true });
      const { selectedPrivacy } = this.props;
      const { isDeposable, isWithdrawable, paymentAddress } = selectedPrivacy;

      if (!isWithdrawable || !isDeposable) {
        return;
      }

      const histories = await getpTokenHistory({ paymentAddress, tokenId: selectedPrivacy?.tokenId });

      this.setState({ historiesFromApi: histories });
    } catch {
      Toast.showError('Can not load withdraw & deposit history right now, please try later');
    } finally {
      this.setState({ isLoading: false });
    }
  }

  loadTokentHistory = async (wallet, account, token) => {
    try {
      this.setState({ isLoading: true });
      if (!wallet) {
        throw new Error('Wallet is not exist to load history');
      }

      if (!account) {
        throw new Error('Account is not exist to load history');
      }

      const histories = await tokenService.getTokenHistory({
        wallet,
        account,
        token
      });
      this.setState({ histories });
    } catch {
      Toast.showError('Can not load history right now, please try later');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { isLoading, histories, historiesFromApi } = this.state;
    const { selectedPrivacy } = this.props;

    if (isLoading || !selectedPrivacy) {
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
        <HistoryList histories={combineHistory(histories, historiesFromApi, selectedPrivacy?.symbol, selectedPrivacy?.externalSymbol, selectedPrivacy?.decimals, selectedPrivacy?.pDecimals)} />
      </ScrollView>
    );
  }
}

const mapState = state => ({
  selectedPrivacy: selectedPrivacySeleclor.selectedPrivacy(state),
  wallet: state.wallet,
  defaultAccount: accountSeleclor.defaultAccount(state),
  tokens: state.token.followed,
});

HistoryTokenContainer.defaultProps = {
  selectedPrivacy: null,
  onLoad: null
};

HistoryTokenContainer.propTypes = {
  selectedPrivacy: PropTypes.object,
  wallet: PropTypes.object.isRequired,
  defaultAccount: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  onLoad: PropTypes.func,
};

export default connect(mapState)(HistoryTokenContainer);
