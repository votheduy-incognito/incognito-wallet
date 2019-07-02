import { ScrollView, Toast } from '@src/components/core';
import HistoryItem from '@src/components/HistoryItem';
import LoadingContainer from '@src/components/LoadingContainer';
import tokenService from '@src/services/wallet/tokenService';
import formatUtil from '@src/utils/format';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

const normalizeData = histories => histories &&
histories.map(h => ({
  txID: h?.txID,
  time: formatUtil.formatDateTime(h?.time),
  receiver: h?.receivers[0],
  amountAndSymbol: `${formatUtil.amount(h?.amount || 0)} ${
    h?.tokenSymbol
  }`,
  fee: formatUtil.amount(h?.fee),
  status: h?.status
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
    const { defaultAccount, wallet } = this.props;
    this.loadTokentHistory(wallet, defaultAccount, this.getToken(this.props));
  }

  componentDidUpdate(prevProps) {
    const { wallet, defaultAccount } = this.props;
    const token = this.getToken(this.props);
    const prevToken = this.getToken(prevProps);

    if (token && (token?.id !== prevToken?.id)) {
      this.loadTokentHistory(wallet, defaultAccount, token);
    }
  }

  getToken = (props) => {
    const { selectedPrivacy, tokens } = props;
    return tokens?.find(t => t?.id === selectedPrivacy?.tokenId);
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
    const { isLoading, histories } = this.state;

    if (isLoading) {
      return <LoadingContainer />;
    }

    return (
      <ScrollView>
        <HistoryItem histories={normalizeData(histories)} />
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

HistoryTokenContainer.propTypes = {
  wallet: PropTypes.objectOf(PropTypes.object),
  defaultAccount: PropTypes.objectOf(PropTypes.object),
  navigation: PropTypes.objectOf(PropTypes.object)
};

export default connect(mapState)(HistoryTokenContainer);
