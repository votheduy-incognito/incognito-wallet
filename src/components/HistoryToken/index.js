import { ScrollView, Toast } from '@src/components/core';
import HistoryList from '@src/components/HistoryList';
import LoadingContainer from '@src/components/LoadingContainer';
import tokenService from '@src/services/wallet/tokenService';
import { getpTokenHistory } from '@src/services/api/history';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CONSTANT_COMMONS } from '@src/constants';
import tokenData from '@src/constants/tokenData';

const combineHistory = (histories, historiesFromApi, symbol) => {
  const currencyType = tokenData.DATA[symbol]?.currencyType;
  const data = [];

  historiesFromApi && historiesFromApi.forEach((h, index) => {
    data.push({
      id: h?.outsideChainTx || index,
      time: h?.updatedAt,
      type: h?.addressType,
      toAddress: h?.userPaymentAddress,
      fromAddress: h?.userPaymentAddress,
      amount: h?.receivedAmount,
      symbol: currencyType,
      statusCode: h?.statusText
    });
  });

  histories && histories.forEach(h => {
    data.push({
      id: h?.txID,
      time: h?.time,
      type: CONSTANT_COMMONS.HISTORY.TYPE.SEND,
      toAddress: h?.receivers[0],
      amount: h?.amount,
      symbol: h?.tokenSymbol,
      statusCode: h?.status
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
    const { defaultAccount, wallet, navigation } = this.props;
  
    navigation.addListener(
      'didFocus',
      () => {
        this.loadTokentHistory(wallet, defaultAccount, this.getToken(this.props));
        this.getHistoryFromApi();
      }
    );
  }

  componentDidUpdate(prevProps) {
    const { wallet, defaultAccount } = this.props;
    const token = this.getToken(this.props);
    const prevToken = this.getToken(prevProps);

    if (token && (token?.id !== prevToken?.id)) {
      this.loadTokentHistory(wallet, defaultAccount, token);
      this.getHistoryFromApi();
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
      const { additionalData } = selectedPrivacy;

      if (!additionalData?.isWithdrawable || !additionalData?.isDeposable) {
        return;
      }

      const histories = await getpTokenHistory({ currencyType: CONSTANT_COMMONS.PRIVATE_TOKEN_HISTORY_CURRENCY_TYPE[additionalData?.currencyType] });

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
      <ScrollView>
        <HistoryList histories={combineHistory(histories, historiesFromApi, selectedPrivacy?.symbol)} />
      </ScrollView>
    );
  }
}

const mapState = state => ({
  selectedPrivacy: state.selectedPrivacy,
  wallet: state.wallet,
  defaultAccount: state.account?.defaultAccount,
  tokens: state.token.followed,
});

HistoryTokenContainer.defaultProps = {
  selectedPrivacy: null
};

HistoryTokenContainer.propTypes = {
  selectedPrivacy: PropTypes.object,
  wallet: PropTypes.object.isRequired,
  defaultAccount: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired
};

export default connect(mapState)(HistoryTokenContainer);
