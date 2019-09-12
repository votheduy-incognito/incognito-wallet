import { RefreshControl, ScrollView, Toast } from '@src/components/core';
import HistoryList from '@src/components/HistoryList';
import LoadingContainer from '@src/components/LoadingContainer';
import { CONSTANT_COMMONS } from '@src/constants';
import tokenData from '@src/constants/tokenData';
import { accountSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import { loadHistoryByAccount } from '@src/services/wallet/WalletService';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

const normalizeData = (histories, decimals, pDecimals) =>
  histories &&
  histories.map(h => ({
    id: h?.txID,
    time: h?.time,
    type: h?.isIn ? CONSTANT_COMMONS.HISTORY.TYPE.RECEIVE : CONSTANT_COMMONS.HISTORY.TYPE.SEND,
    toAddress: h?.receivers[0],
    amount: h?.amount,
    symbol: tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY,
    status: h?.status,
    decimals,
    pDecimals
  }));
const TAG = 'MainCryptoHistory';
class MainCryptoHistory extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: true,
      histories: []
    };
  }

  componentWillMount() {
    const { navigation } = this.props;

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
      this.handleLoadHistory();
    }
  }

  handleLoadHistory = async () => {
    console.log(TAG,'handleLoadHistory begin');
    const { histories } = this.state;
    this.setState({ isLoading: true });
    const { defaultAccount: { name } = {}, wallet } = this.props;
    let historiesNew = await this.loadAccountHistory(wallet, name).catch(console.log)||histories;

    this.setState({ histories:historiesNew,isLoading: false });
    console.log(TAG,'handleLoadHistory end');
  }

  loadAccountHistory = async (wallet, accountName) => {
    try {
      if (!wallet) {
        throw new Error('Wallet is not exist to load history');
      }

      if (!accountName) {
        throw new Error('Account is not exist to load history');
      }
      console.log(TAG,'loadAccountHistory begin');
      const histories = await loadHistoryByAccount(wallet, accountName);
      console.log(TAG,'loadAccountHistory end');
      return histories;
    } catch {
      Toast.showError('Something went wrong. Please refresh the screen.');
    }
  };


  handleScrollReload = () => {
    const { onLoad } = this.props;
    if (typeof onLoad === 'function') {
      onLoad();
    }

    this.handleLoadHistory();
  }

  render() {
    const { isLoading, histories } = this.state;
    const { selectedPrivacy } = this.props;

    if (isLoading || !selectedPrivacy) {
      return <LoadingContainer />;
    }

    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        refreshControl={(
          <RefreshControl
            refreshing={isLoading}
            onRefresh={this.handleScrollReload}
          />
        )}
      >
        <HistoryList histories={normalizeData(histories, selectedPrivacy?.decimals, selectedPrivacy?.pDecimals)} />
      </ScrollView>
    );
  }
}

const mapState = state => ({
  wallet: state.wallet,
  defaultAccount: accountSeleclor.defaultAccount(state),
  selectedPrivacy: selectedPrivacySeleclor.selectedPrivacy(state),
});

MainCryptoHistory.defaultProps = {
  onLoad: null
};

MainCryptoHistory.propTypes = {
  wallet: PropTypes.object.isRequired,
  defaultAccount: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  onLoad: PropTypes.func,
  selectedPrivacy: PropTypes.object,
};

export default connect(mapState)(MainCryptoHistory);
