import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoadingContainer from '@src/components/LoadingContainer';
import History from '@src/components/History';
import formatUtil from '@src/utils/format';
import { CONSTANT_COMMONS } from '@src/constants';
import tokenService from '@src/services/wallet/tokenService';
import { Toast, ScrollView } from '@src/components/core';

const normalizeData = histories => histories && histories.map(h => ({
  txID: h.txID,
  time: formatUtil.formatDateTime(h.time),
  receiver: h.receivers[0],
  amountAndSymbol: `${formatUtil.amountConstant(h.amount)} ${CONSTANT_COMMONS.CONST_SYMBOL}`,
  fee: h.fee,
  status: h.status
}));

class HistoryTokenContainer extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      histories: []
    };
  }

  componentDidMount() {
    const { defaultAccount, wallet, navigation } = this.props;
    this.loadTokentHistory(wallet, defaultAccount, this.getToken(navigation));
  }

  componentDidUpdate(prevProps) {
    const { wallet, defaultAccount, navigation } = this.props;
    const { navigation: prevNavigation } = prevProps;
    const token = this.getToken(navigation);
    const prevToken = this.getToken(prevNavigation);
    
    if (token?.ID !== prevToken?.ID) {
      this.loadTokentHistory(wallet, defaultAccount, token);
    }
  }

  getToken = (navigation) => navigation.getParam('token')

  loadTokentHistory = async (wallet, account, token) => {
    try {
      this.setState({ isLoading: true });
      if (!wallet) {
        throw new Error('Wallet is not exist to load history');
      }

      if (!account) {
        throw new Error('Account is not exist to load history');
      }

      const histories = await tokenService.getTokenHistory({ wallet, account, token });
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
      <ScrollView>
        <History histories={normalizeData(histories)} />
      </ScrollView>
    );
  }
}

const mapState = state => ({
  wallet: state.wallet,
  defaultAccount: state.account?.defaultAccount
});

HistoryTokenContainer.propTypes = {
  wallet: PropTypes.object,
  defaultAccount: PropTypes.object,
  navigation: PropTypes.object
};

export default connect(mapState)(HistoryTokenContainer);